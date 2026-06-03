import { resolveApiAssetUrl } from '@/src/core/api/resolveApiAssetUrl';
import type { LoginCodeUserPayload } from '@/src/core/api/types';
import type { AppMemberRole, User } from '@/src/domain/entities';

function trimOrUndefined(value: string | null | undefined): string | undefined {
  const t = value?.trim();
  return t && t.length > 0 ? t : undefined;
}

/** Maps API user payloads (login or GET /api/user/me) to domain {@link User}. */
export function userFromApiPayload(remote: LoginCodeUserPayload): User {
  const firstName = trimOrUndefined(remote.firstname);
  const lastName = trimOrUndefined(remote.lastname);
  const parts = [firstName, lastName].filter((p): p is string => Boolean(p));
  const fullNameTrimmed = remote.full_name.trim();
  const name =
    parts.length > 0
      ? parts.join(' ')
      : fullNameTrimmed.length > 0 && fullNameTrimmed !== '-'
        ? fullNameTrimmed
        : remote.email;
  const role: AppMemberRole = 'assistant';
  const phone = remote.full_phone?.trim();
  const lang = remote.language?.name?.trim();
  const avatarRaw = trimOrUndefined(remote.avatar ?? undefined);
  return {
    id: String(remote.id),
    email: remote.email,
    name,
    firstName,
    lastName,
    avatarUrl: avatarRaw ? resolveApiAssetUrl(avatarRaw) : undefined,
    role,
    fullPhone: phone && phone.length > 0 ? phone : undefined,
    languageName: lang && lang.length > 0 ? lang : undefined,
  };
}
