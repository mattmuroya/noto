import { z } from 'zod';
import { newNoteSchema, updateNoteSchema } from '../schemas/note.schema';

export type NewNote = z.infer<typeof newNoteSchema>;
export type UpdateNote = z.infer<typeof updateNoteSchema>;
