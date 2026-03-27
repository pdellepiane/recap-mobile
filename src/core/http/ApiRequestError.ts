export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export function isApiRequestError(e: unknown): e is ApiRequestError {
  return e instanceof ApiRequestError;
}

function firstValidationMessage(errors: Record<string, unknown>): string | null {
  for (const val of Object.values(errors)) {
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
      return val[0];
    }
    if (typeof val === 'string') {
      return val;
    }
  }
  return null;
}

export function messageFromUnknownErrorBody(status: number, body: unknown): string {
  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    if (typeof o.error === 'string') {
      return o.error;
    }
    if (typeof o.message === 'string') {
      return o.message;
    }
    if (o.errors && typeof o.errors === 'object' && !Array.isArray(o.errors)) {
      const msg = firstValidationMessage(o.errors as Record<string, unknown>);
      if (msg) {
        return msg;
      }
    }
  }
  if (typeof body === 'string' && body.length > 0) {
    return body;
  }
  return `Request failed (${status})`;
}
