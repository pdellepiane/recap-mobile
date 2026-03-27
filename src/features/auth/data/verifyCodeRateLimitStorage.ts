import * as SecureStore from 'expo-secure-store';

const STORE_KEY = 'recap_verify_code_rate_v1';

/** Failed verify attempts that trigger a 1-hour resend lock. */
const RESEND_LOCK_AFTER_FAILURES = 3;

/** Resend is disabled until this duration elapses after the 3rd failed verify. */
const RESEND_LOCK_AFTER_FAILURES_MS = 60 * 60 * 1000;

type VerifyEmailState = {
  failedAttempts: number;
  resendLockedUntil: number | null;
};

type StoreShape = Record<string, VerifyEmailState>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function effectiveState(raw: VerifyEmailState, now: number): VerifyEmailState {
  if (raw.resendLockedUntil != null && raw.resendLockedUntil <= now) {
    return { failedAttempts: 0, resendLockedUntil: null };
  }
  return raw;
}

async function readAll(): Promise<StoreShape> {
  const raw = await SecureStore.getItemAsync(STORE_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as StoreShape;
  } catch {
    return {};
  }
}

async function writeAll(data: StoreShape): Promise<void> {
  await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(data));
}

/**
 * Returns persisted verify/rate state for `email`, pruning an expired resend lock from storage.
 */
export async function loadVerifyCodeRateState(email: string): Promise<VerifyEmailState> {
  const key = normalizeEmail(email);
  if (!key) {
    return { failedAttempts: 0, resendLockedUntil: null };
  }
  const all = await readAll();
  const raw = all[key];
  if (!raw) {
    return { failedAttempts: 0, resendLockedUntil: null };
  }
  const now = Date.now();
  const eff = effectiveState(raw, now);
  if (
    eff.failedAttempts !== raw.failedAttempts ||
    eff.resendLockedUntil !== raw.resendLockedUntil
  ) {
    if (eff.failedAttempts === 0 && eff.resendLockedUntil == null) {
      delete all[key];
    } else {
      all[key] = eff;
    }
    await writeAll(all);
  }
  return eff;
}

/**
 * Increments failed verify attempts for `email`; after three failures,
 * sets `resendLockedUntil` to now + 1 hour.
 */
export async function recordFailedVerifyAttempt(email: string): Promise<VerifyEmailState> {
  const key = normalizeEmail(email);
  if (!key) {
    return { failedAttempts: 0, resendLockedUntil: null };
  }
  const all = await readAll();
  const raw = all[key] ?? { failedAttempts: 0, resendLockedUntil: null };
  const now = Date.now();
  let { failedAttempts, resendLockedUntil } = effectiveState(raw, now);
  failedAttempts += 1;
  if (failedAttempts >= RESEND_LOCK_AFTER_FAILURES) {
    resendLockedUntil = now + RESEND_LOCK_AFTER_FAILURES_MS;
  }
  const next = { failedAttempts, resendLockedUntil };
  all[key] = next;
  await writeAll(all);
  return next;
}

/** Clears rate data for `email` (after successful verify or successful resend). */
export async function clearVerifyCodeRateState(email: string): Promise<void> {
  const key = normalizeEmail(email);
  if (!key) {
    return;
  }
  const all = await readAll();
  if (all[key] == null) {
    return;
  }
  delete all[key];
  await writeAll(all);
}
