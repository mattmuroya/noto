import { prisma } from '../utils/prisma';

export const getNotes = () => {
  return prisma.note.findMany({
    orderBy: { updatedAt: 'desc' },
  });
};

export const createNote = (title: string, content: string) => {
  return prisma.note.create({
    data: { title, content },
  });
};

export const updateNote = (id: string, title: string, content: string) => {
  return prisma.note.update({
    where: { id },
    data: { title, content },
  });
};

export const deleteNote = (id: string) => {
  return prisma.note.delete({
    where: { id },
  });
};
