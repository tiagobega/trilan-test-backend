export interface ErrorPayload {
  code: string;
  message: string;
  expected?: string | string[];
  received?: string | string[];
  path?: string | string[];
}

export const ERROR_TYPE = {
  USER_TAKEN: 'user_taken_error',
  VALIDATION: 'validation_error',
  NOT_FOUND_DATA: 'not_found_data_error',
  AUTH: 'auth_error',
  JWT_PAYLOAD: 'jwt_payload_error',
  REFRESH_TOKEN: 'refresh_token_error',
} as const;

export class HttpError extends Error {
  constructor(private readonly errors: ErrorPayload[] = []) {
    super();
  }

  addError(payload: ErrorPayload) {
    this.errors.push(payload);
  }

  get httpStatus() {
    return 500;
  }

  get issues() {
    return this.errors;
  }
}

export class BadRequest extends HttpError {
  constructor(errors: ErrorPayload[] = []) {
    super(errors);
  }

  public get httpStatus() {
    return 400;
  }
}

export class Unauthorized extends HttpError {
  constructor(errors: ErrorPayload[]) {
    super(errors);
  }

  public get httpStatus() {
    return 401;
  }
}

export class AuthError extends HttpError {
  constructor(errors: ErrorPayload[] = []) {
    super(errors);
  }

  public get httpStatus() {
    return 403;
  }
}

export class NotFound extends HttpError {
  constructor(errors: ErrorPayload[] = []) {
    super(errors);
  }

  public get httpStatus() {
    return 404;
  }
}
