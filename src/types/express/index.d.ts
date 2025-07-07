import type { JwtPayload } from 'jsonwebtoken';
import { PublicUser } from '../user.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & PublicUser;
    }
  }
}
