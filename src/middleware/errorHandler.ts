// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // Catch validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.flatten(),
    });
  }

  // Catch explicit HTTP throws
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Fallback for unknown errors
  res.status(500).json({ error: 'Internal Server Error' });
};
