import { Request, Response, NextFunction } from 'express';
import { HttpError, HttpStatusCode } from '../errors/HttpError';
import { verifyAccessToken } from '../utils/token';
import { PublicUser } from '../types/user.types';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpError('No token provided', HttpStatusCode.Unauthorized401);
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAccessToken(token);
    req.user = payload as PublicUser;
    next();
  } catch (err) {
    next(err);
  }
};
