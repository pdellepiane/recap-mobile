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

export type ApiUserAccountType = 'individual' | 'legal_entity';

export type ApiAuthCredentials = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type ApiAuthUser = {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  type: ApiUserAccountType;
  email_verified_at: string | null;
  last_login_at: string | null;
  credentials: ApiAuthCredentials;
};

export type LoginCodeSuccessResponse = {
  status: boolean;
  data: {
    user: ApiAuthUser;
  };
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
