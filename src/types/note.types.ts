import { z } from 'zod';
import { newNoteSchema } from '../schemas/note.schema';

export type NewNote = z.infer<typeof newNoteSchema>;
