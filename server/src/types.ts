import { z } from 'zod';
import { loginSchema, registrationSchema } from './schemas/auth.schema';
import { newNoteSchema } from './schemas/note.schema';
import { User } from '@prisma/client';

export type PublicUser = Omit<User, 'passwordHash' | 'createdAt' | 'updatedAt'>;
export type Registration = z.infer<typeof registrationSchema>;
export type NewNote = z.infer<typeof newNoteSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type AccessToken = {
  token: string;
  duration: number;
  expiry: Date;
};

export type RefreshToken = {
  token: string;
  duration: number;
  expiry: Date;
};
