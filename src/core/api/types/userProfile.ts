import type { LoginCodeUserPayload } from './auth';

/** PATCH /api/user/profile */
export type UpdateUserProfileBody = {
  firstname: string;
  lastname: string;
};

export type UpdateUserProfileResponse = {
  data: LoginCodeUserPayload | null;
  status: boolean;
  errors: unknown;
  error: string | null;
};

/** POST /api/user/avatar (multipart field `avatar`) */
export type UploadUserAvatarResponse = {
  data: { avatar: string } | LoginCodeUserPayload | null;
  status: boolean;
  errors: unknown;
  error: string | null;
};
