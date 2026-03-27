export type HttpAuthMode = 'none' | 'bearer';

export type HttpGetOptions = {
  auth?: HttpAuthMode;
};

export type HttpPostOptions = {
  auth?: HttpAuthMode;
};

/** App-wide HTTP abstraction used by repositories (mock or real transport). */
export type HttpClient = {
  get<T>(path: string, options?: HttpGetOptions): Promise<T>;
  post<T>(path: string, body: object, options?: HttpPostOptions): Promise<T>;
};
