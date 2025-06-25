import bcrypt from 'bcrypt';
import { prisma } from '../prisma';

export async function createUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Save the new user to the database
  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return newUser;
}
