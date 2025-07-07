import { z } from 'zod';
import { loginSchema, registrationSchema } from '../schemas/auth.schema';

export type Registration = z.infer<typeof registrationSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
