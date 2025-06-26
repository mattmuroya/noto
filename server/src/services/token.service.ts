import jwt from 'jsonwebtoken';
import { AccessToken, PublicUser, RefreshToken } from '../types';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user: PublicUser): AccessToken => {
  if (!accessTokenSecret) {
    throw new Error('Missing environment variable ACCESS_TOKEN_SECRET');
  }

  const token = jwt.sign(user, accessTokenSecret, { expiresIn: '15m' });
  const duration = 15 * 60 * 1000; // 15m in ms
  const expiry = new Date(Date.now() + duration);

  return {
    token,
    duration,
    expiry,
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
  const expiry = new Date(Date.now() + duration);

  return {
    token,
    duration,
    expiry,
  };
};

// export const verifyRefreshToken = (token: string): PublicUser => {
//   if (!refreshTokenSecret) {
//     throw new Error('Missing environment variable REFRESH_TOKEN_SECRET');
//   }

//   return jwt.verify(token, refreshTokenSecret) as PublicUser;
// };
