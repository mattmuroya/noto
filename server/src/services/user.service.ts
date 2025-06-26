import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { PublicUser, LoginCredentials } from '../types';

export const createUser = async (
  email: string,
  password: string
): Promise<PublicUser> => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
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
    throw new Error('Invalid email or password'); // Hash uses full payload
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};
