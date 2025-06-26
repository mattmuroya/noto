import { prisma } from '../prisma';
import { LoginCredentials } from '../types';
import { verifyUserLogin } from './user.service';
import { generateAccessToken, generateRefreshToken } from './token.service';

export const loginUser = async (login: LoginCredentials) => {
  const user = await verifyUserLogin(login);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshToken.token,
      expiresAt: refreshToken.expiry,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};
