import { LoginCredentials } from '../types/auth.types';
import { HttpError, HttpStatusCode } from '../errors/HttpError';
import { verifyUserLogin, getUserById } from './user.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/token';
import {
  createSession,
  getSessionByToken,
  deleteSessionByToken,
} from './session.service';

export const loginUser = async (login: LoginCredentials) => {
  // Verify credentials and retrieve user; throws if invalid
  const user = await verifyUserLogin(login);

  // Generate access tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save session to db; throws if error
  await createSession({
    userId: user.id,
    token: refreshToken.token,
    expiresAt: refreshToken.expiration,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const rotateRefreshToken = async (token: string) => {
  // Verify JWT signature and expiration; throws if invalid/expired
  const tokenUser = verifyRefreshToken(token);

  // Verify existing user session; throws if not found
  const session = await getSessionByToken(token);

  // Double-check expiration (technically redundant w/ JWT verification)
  if (session.expiresAt < new Date()) {
    throw new HttpError('Session expired', HttpStatusCode.Unauthorized401);
  }

  // Delete (revoke) existing session
  await deleteSessionByToken(token);

  // Verify user exists in db
  const user = await getUserById(tokenUser.id);

  // Generate new access tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Create new session
  await createSession({
    userId: user.id,
    token: newRefreshToken.token,
    expiresAt: newRefreshToken.expiration,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (token: string) => {
  await deleteSessionByToken(token);
};
