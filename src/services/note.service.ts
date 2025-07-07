import { prisma } from '../utils/prisma';
import { NewNote } from '../types/note.types';

export const getNotesByUserId = async (userId: string) => {
  // if (!userId) {
  //   throw new HttpError(
  //     'Missing authorization token',
  //     HttpStatusCode.Unauthorized401
  //   );
  // }
  // Token validation handled by requireAuth

  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
};

export const createNote = async (note: NewNote, userId: string) => {
  // if (!userId) {
  //   throw new HttpError(
  //     'Missing authorization token',
  //     HttpStatusCode.Unauthorized401
  //   );
  // }
  // Token validation handled by requireAuth

  return prisma.note.create({
    data: {
      title: note.title,
      content: note.content,
      userId,
    },
  });
};
