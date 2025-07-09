import { prisma } from '../utils/prisma';
import { NewNote, UpdateNote } from '../types/note.types';
import { HttpError, HttpStatusCode } from '../errors/HttpError';
import { Prisma } from '@prisma/client';

export const getNotesByUserId = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
};

export const createNewNote = async (note: NewNote, userId: string) => {
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

export const updateNoteById = async (
  id: string,
  updateNote: UpdateNote,
  userId: string
) => {
  try {
    return await prisma.note.update({
      where: { id, userId },
      data: updateNote,
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      throw new HttpError('Not Found', HttpStatusCode.NotFound404);
    }
  }
};

export const deleteNoteById = async (id: string, userId: string) => {
  try {
    await prisma.note.delete({
      where: { id, userId },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      throw new HttpError('Not Found', HttpStatusCode.NotFound404);
    }
  }
};
