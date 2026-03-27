import type { User } from './User';

/** Logged-in state: accounts are created on the web app; this app only holds an authenticated session. */
export type AuthSession = {
  user: User;
};
