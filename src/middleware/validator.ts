import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate/type incoming request; throws if invalid
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};
