import { z } from 'zod';

export const newNote = z.object({
  title: z.string().min(0),
  content: z.string().min(0),
});
