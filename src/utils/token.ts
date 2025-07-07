import jwt from 'jsonwebtoken';
import { AccessToken, RefreshToken } from '../types/token.types';
import { PublicUser } from '../types/user.types';
import { HttpError, HttpStatusCode } from '../errors/HttpError';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user: PublicUser): AccessToken => {
  if (!accessTokenSecret) {
    throw new Error('Missing environment variable ACCESS_TOKEN_SECRET');
  }

  const token = jwt.sign(user, accessTokenSecret, { expiresIn: '15m' });
  const duration = 15 * 60 * 1000; // 15m in ms
  const expiration = new Date(Date.now() + duration);

  return {
    token,
    duration,
    expiration,
  };
};

export const generateRefreshToken = (user: PublicUser): RefreshToken => {
  if (!refreshTokenSecret) {
    throw new Error('Missing environment variable REFRESH_TOKEN_SECRET');
  }

  const token = jwt.sign(user, refreshTokenSecret, {
    expiresIn: '7d',
  });

  const duration = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const expiration = new Date(Date.now() + duration);

  return {
    token,
    duration,
    expiration,
  };
};

export const verifyAccessToken = (token: string): PublicUser => {
  if (!accessTokenSecret) {
    throw new Error('Missing environment variable ACCESS_TOKEN_SECRET');
  }

  try {
    return jwt.verify(token, accessTokenSecret) as PublicUser;
  } catch {
    throw new HttpError(
      'Invalid or expired token',
      HttpStatusCode.Unauthorized401
    );
  }
};

export const verifyRefreshToken = (token: string): PublicUser => {
  if (!refreshTokenSecret) {
    throw new Error('Missing environment variable REFRESH_TOKEN_SECRET');
  }

  try {
    return jwt.verify(token, refreshTokenSecret) as PublicUser;
  } catch {
    throw new HttpError(
      'Invalid or expired token',
      HttpStatusCode.Unauthorized401
    );
  }
};
