import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { PublicUser } from '../types/user.types';
import { LoginCredentials } from '../types/auth.types';
import { HttpError, HttpStatusCode } from '../errors/HttpError';

export const getUserById = async (id: string): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new HttpError('User not found', HttpStatusCode.NotFound404);
  }

  return user;
};

export const createUser = async (
  email: string,
  password: string
): Promise<PublicUser> => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new HttpError('Email already in use', HttpStatusCode.Conflict409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
};

export const verifyUserLogin = async (
  login: LoginCredentials
): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({ where: { email: login.email } });

  if (!user) {
    throw new HttpError('Email not found', HttpStatusCode.Unauthorized401);
  }

  const passwordValid = await bcrypt.compare(login.password, user.passwordHash);

  if (!passwordValid) {
    throw new HttpError('Invalid password', HttpStatusCode.Unauthorized401);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};
