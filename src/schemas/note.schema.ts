import { z } from 'zod';

export const newNoteSchema = z.object({
  title: z.string().min(0),
  content: z.string().min(0),
});

export const updateNoteSchema = z.object({
  title: z.string().min(0),
  content: z.string().min(0),
});
