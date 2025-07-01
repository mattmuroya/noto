import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { PublicUser, LoginCredentials } from '../types';
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
    throw new Error('Email already in use');
  }

  const passwordValid = await bcrypt.compare(login.password, user.passwordHash);

  if (!passwordValid) {
    throw new HttpError(
      'Invalid email or password',
      HttpStatusCode.Unauthorized401
    ); // Hash uses full payload
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};
