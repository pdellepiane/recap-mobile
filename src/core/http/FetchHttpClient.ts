import { ApiRequestError, messageFromUnknownErrorBody } from './ApiRequestError';
import type { FetchOpts } from './FetchOpts';
import type { HttpClient } from './HttpClient';
import { runSessionExpiredFlow } from '@/src/core/auth/sessionExpiredBridge';

export type FetchHttpClientOptions = {
  getAccessToken?: () => string | null | Promise<string | null>;
};

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

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
    init: { auth?: FetchOpts['auth'] },
    jsonBody: boolean,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (jsonBody) {
      headers['Content-Type'] = 'application/json';
    }
    if (init.auth === 'bearer') {
      const token = await this.options.getAccessToken?.();
      if (token) {
        console.log('token', token);
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async parseResponse<T>(
    res: Response,
    meta: {
      method: string;
      url: string;
      requestBody?: unknown;
      auth?: FetchOpts['auth'];
    },
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
    if (res.status === 401 && meta.auth === 'bearer') {
      await runSessionExpiredFlow(this.baseUrl);
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

  async get<T>(path: string, options: FetchOpts = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'GET', url, {});
    const res = await fetch(url, {
      method: 'GET',
      headers: await this.headersFor(options, false),
      signal: options.signal,
    });
    return this.parseResponse<T>(res, { method: 'GET', url, auth: options.auth });
  }

  async post<T>(path: string, body: object, options: FetchOpts = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'POST', url, { requestBody: body });
    const res = await fetch(url, {
      method: 'POST',
      headers: await this.headersFor(options, true),
      body: JSON.stringify(body),
      signal: options.signal,
    });
    return this.parseResponse<T>(res, {
      method: 'POST',
      url,
      requestBody: body,
      auth: options.auth,
    });
  }

  async postFormData<T>(path: string, body: FormData, options: FetchOpts = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'POST', url, { requestBody: '[FormData]' });
    const res = await fetch(url, {
      method: 'POST',
      headers: await this.headersFor(options, false),
      body,
      signal: options.signal,
    });
    return this.parseResponse<T>(res, {
      method: 'POST',
      url,
      requestBody: '[FormData]',
      auth: options.auth,
    });
  }

  async patch<T>(path: string, body: object, options: FetchOpts = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'PATCH', url, { requestBody: body });
    const res = await fetch(url, {
      method: 'PATCH',
      headers: await this.headersFor(options, true),
      body: JSON.stringify(body),
      signal: options.signal,
    });
    return this.parseResponse<T>(res, {
      method: 'PATCH',
      url,
      requestBody: body,
      auth: options.auth,
    });
  }

  async put<T>(path: string, body: object, options: FetchOpts = {}): Promise<T> {
    const url = this.resolveUrl(path);
    logHttp('→', 'PUT', url, { requestBody: body });
    const res = await fetch(url, {
      method: 'PUT',
      headers: await this.headersFor(options, true),
      body: JSON.stringify(body),
      signal: options.signal,
    });
    return this.parseResponse<T>(res, {
      method: 'PUT',
      url,
      requestBody: body,
      auth: options.auth,
    });
  }
}
