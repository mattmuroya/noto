import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    // Early return on failed validation
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }

    // Replace req.body with cleaned/typed version of request data
    req.body = result.data;
    next();
  };
};
