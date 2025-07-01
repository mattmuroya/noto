// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Fallback for unknown errors
  res.status(500).json({ error: 'Internal Server Error' });
};
