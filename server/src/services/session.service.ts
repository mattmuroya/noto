import { prisma } from '../prisma';
import { HttpError, HttpStatusCode } from '../errors/HttpError';
import { CreateSessionParams } from '../types/types.session';

export const getSessionByToken = async (token: string) => {
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    throw new HttpError('Session not found', HttpStatusCode.NotFound404);
  }

  return session;
};

export const createSession = async ({
  userId,
  token,
  expiresAt,
}: CreateSessionParams) => {
  const service = await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  if (!service) {
    throw new HttpError(
      'Unable to create session',
      HttpStatusCode.InternalServerError500
    );
  }
};

export const deleteSessionByToken = async (token: string) => {
  await prisma.session.delete({
    where: { token },
  });
};
