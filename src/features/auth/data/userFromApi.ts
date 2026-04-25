import type { LoginCodeUserPayload } from '@/src/core/api/types';
import type { AppMemberRole, User } from '@/src/domain/entities';

/** Maps API user payloads (login or GET /api/user/me) to domain {@link User}. */
export function userFromApiPayload(remote: LoginCodeUserPayload): User {
  const parts = [remote.firstname, remote.lastname].filter(
    (p): p is string => typeof p === 'string' && p.trim().length > 0,
  );
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
  return {
    id: String(remote.id),
    email: remote.email,
    name,
    role,
    fullPhone: phone && phone.length > 0 ? phone : undefined,
    languageName: lang && lang.length > 0 ? lang : undefined,
  };
}
