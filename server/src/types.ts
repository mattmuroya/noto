import { z } from 'zod';
import { registrationSchema } from './schemas/auth.schema';
import { newNoteSchema } from './schemas/note.schema';

export type Registration = z.infer<typeof registrationSchema>;
export type NewNote = z.infer<typeof newNoteSchema>;
