import { prisma } from '../prisma';
import { LoginCredentials } from '../types';
import { verifyUserLogin } from './user.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from './token.service';

export const loginUser = async (login: LoginCredentials) => {
  // Verify credentials and retrieve user; throws if invalid
  const user = await verifyUserLogin(login);

  // Generate access tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Create session
  await prisma.session.create({
    data: {
      userId: user.id,
      token: refreshToken.token,
      expiresAt: refreshToken.expiry,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const rotateRefreshToken = async (token: string) => {
  // Find existing user session
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) throw new Error('Session not found');

  // Verify JWT signature and expiration; throws if invalid
  const tokenUser = verifyRefreshToken(token);

  // Delete (revoke) existing session
  await prisma.session.delete({
    where: { token },
  });

  // Verify user exists in db
  const user = await prisma.user.findUnique({
    where: { id: tokenUser.id },
  });

  if (!user) throw new Error('User not found');

  // Generate new access tokens
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Create new session
  await prisma.session.create({
    data: {
      userId: user.id,
      token: newRefreshToken.token,
      expiresAt: newRefreshToken.expiry,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
