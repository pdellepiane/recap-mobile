import type { AppMemberRole } from './AppMemberRole';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: AppMemberRole;
  /** From API `full_phone` when present. */
  fullPhone?: string;
  /** From API `language.name` when present. */
  languageName?: string;
};
