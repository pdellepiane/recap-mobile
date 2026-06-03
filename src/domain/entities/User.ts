import type { AppMemberRole } from './AppMemberRole';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: AppMemberRole;
  firstName?: string;
  lastName?: string;
  /** Resolved URL for API `avatar` when present. */
  avatarUrl?: string;
  /** From API `full_phone` when present. */
  fullPhone?: string;
  /** From API `language.name` when present. */
  languageName?: string;
};
