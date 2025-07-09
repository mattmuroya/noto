export enum HttpStatusCode {
  OK200 = 200,
  Created201 = 201,
  NoContent204 = 204,
  BadRequest400 = 400,
  Unauthorized401 = 401,
  Forbidden403 = 403,
  NotFound404 = 404,
  Conflict409 = 409,
  InternalServerError500 = 500,
}

export class HttpError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.InternalServerError500
  ) {
    super(message);
    this.statusCode = statusCode;

    // Create this.stack property; omit stack frames for this.constructor and above
    Error.captureStackTrace(this, this.constructor);
  }
}
