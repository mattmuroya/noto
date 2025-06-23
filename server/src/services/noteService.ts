import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// These functions return raw promises; no need to mark as async

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

export default { getNotes, createNote, updateNote, deleteNote };
