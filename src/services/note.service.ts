import { prisma } from '../utils/prisma';
import { NewNote } from '../types/note.types';
import { HttpError, HttpStatusCode } from '../errors/HttpError';

export const getNotesByUserId = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
};

export const createNote = async (note: NewNote, userId: string) => {
  return prisma.note.create({
    data: {
      title: note.title,
      content: note.content,
      userId,
    },
  });
};

export const getNoteById = async (id: string, userId: string) => {
  if (!id) {
    throw new HttpError('No id provided', HttpStatusCode.BadRequest400);
  }

  const note = await prisma.note.findUnique({
    where: { id, userId },
  });

  if (!note) {
    throw new HttpError('Not Found', HttpStatusCode.NotFound404);
  }

  return note;
};
