/**
 * Wire types for POST /api/auth/* (email OTP login, JWT, logout).
 */

export type RequestLoginCodeBody = {
  email: string;
};

export type RequestLoginCodeResponse = {
  status: boolean;
  message: string;
};

export type LoginCodeBody = {
  email: string;
  /** 6-digit numeric string */
  code: string;
};

export type LoginCodeLanguagePayload = {
  id: number;
  code: string;
  region: string;
  locale: string;
  name: string;
};

/** {@link AuthUserResource} from POST /api/auth/login-code. */
export type LoginCodeUserPayload = {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  full_name: string;
  full_phone: string;
  language_id: number | null;
  language: LoginCodeLanguagePayload;
  created_at: string | null;
  updated_at: string | null;
};

/** POST /api/auth/login-code success body (`status` + `user` + JWT fields). */
export type LoginCodeSuccessResponse = {
  status: boolean;
  user: LoginCodeUserPayload;
  token: string | null;
  token_type: string;
  expires_in: number;
};

export type LogoutSuccessResponse = {
  message: string;
};

export type ValidationErrorResponse = {
  status: boolean;
  errors: Record<string, string[] | string>;
};

export type SimpleStatusErrorResponse = {
  status: boolean;
  error: string;
};

export type LogoutUnauthorizedResponse = {
  message: string;
};

export type ApiErrorBody =
  | ValidationErrorResponse
  | SimpleStatusErrorResponse
  | LogoutUnauthorizedResponse
  | Record<string, unknown>;
