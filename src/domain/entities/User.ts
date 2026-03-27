import type { AppMemberRole } from './AppMemberRole';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: AppMemberRole;
};
