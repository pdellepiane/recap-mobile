import { ApiRequestError, messageFromUnknownErrorBody } from './ApiRequestError';
import type { HttpClient, HttpGetOptions, HttpPostOptions } from './HttpClient';

export type FetchHttpClientOptions = {
  getAccessToken?: () => string | null | Promise<string | null>;
};

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

const RESPONSE_LOG_MAX_CHARS = 2000;

function logHttp(
  direction: '→' | '←',
  method: string,
  url: string,
  payload: {
    requestBody?: unknown;
    status?: number;
    responseBody?: string;
  },
): void {
  if (typeof __DEV__ === 'undefined' || !__DEV__) {
    return;
  }
  const parts: string[] = [`[HTTP] ${direction} ${method} ${url}`];
  if (payload.requestBody !== undefined) {
    parts.push(`request=${JSON.stringify(payload.requestBody)}`);
  }
  if (payload.status !== undefined) {
    parts.push(`status=${String(payload.status)}`);
  }
  if (payload.responseBody !== undefined) {
    const body =
      payload.responseBody.length > RESPONSE_LOG_MAX_CHARS
        ? `${payload.responseBody.slice(0, RESPONSE_LOG_MAX_CHARS)}…`
        : payload.responseBody;
    parts.push(`response=${body}`);
  }
  console.log(parts.join(' | '));
}

/**
 * Production HTTP client: JSON GET/POST against a single API base URL, optional Bearer token.
 */
export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly options: FetchHttpClientOptions = {},
  ) {}

  private resolveUrl(path: string): string {
    const base = trimTrailingSlash(this.baseUrl);
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  }

  private async headersFor(
    init: { auth?: HttpGetOptions['auth'] },
    jsonBody: boolean,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (jsonBody) {
      headers['Content-Type'] = 'application/json';
    }
    if (init.auth === 'bearer') {
      const token = await this.options.getAccessToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async parseResponse<T>(
    res: Response,
    meta: { method: string; url: string; requestBody?: unknown },
  ): Promise<T> {
    const text = await res.text();
    logHttp('←', meta.method, meta.url, {
      requestBody: meta.requestBody,
      status: res.status,
      responseBody: text.length === 0 ? '(empty)' : text,
    });

    let parsed: unknown;
    if (text.length === 0) {
      parsed = undefined;
    } else {
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        parsed = text;
      }
    }
    if (!res.ok) {
      throw new ApiRequestError(
        messageFromUnknownErrorBody(res.status, parsed),
        res.status,
        parsed,
      );
    }
    return parsed as T;
  }

  async get<T>(path: string, options: HttpGetOptions = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'GET', url, {});
    const res = await fetch(url, {
      method: 'GET',
      headers: await this.headersFor(options, false),
    });
    return this.parseResponse<T>(res, { method: 'GET', url });
  }

  async post<T>(path: string, body: object, options: HttpPostOptions = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'POST', url, { requestBody: body });
    const res = await fetch(url, {
      method: 'POST',
      headers: await this.headersFor(options, true),
      body: JSON.stringify(body),
    });
    return this.parseResponse<T>(res, { method: 'POST', url, requestBody: body });
  }
}
