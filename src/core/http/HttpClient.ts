import type { FetchOpts } from './FetchOpts';

export type HttpAuthMode = 'none' | 'bearer';

/** @deprecated Use {@link FetchOpts} */
export type HttpGetOptions = FetchOpts;

/** @deprecated Use {@link FetchOpts} */
export type HttpPostOptions = FetchOpts;

/** App-wide HTTP abstraction used by repositories (e.g. {@link FetchHttpClient}). */
export type HttpClient = {
  get<T>(path: string, options?: FetchOpts): Promise<T>;
  post<T>(path: string, body: object, options?: FetchOpts): Promise<T>;
  postFormData<T>(path: string, body: FormData, options?: FetchOpts): Promise<T>;
  patch<T>(path: string, body: object, options?: FetchOpts): Promise<T>;
  put<T>(path: string, body: object, options?: FetchOpts): Promise<T>;
};
