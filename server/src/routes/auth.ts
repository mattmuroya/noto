import { Router } from 'express';
import { validate } from '../middleware/validator';
import { loginSchema, registrationSchema } from '../schemas/auth.schema';
import {
  register,
  login,
  refresh,
  logout,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registrationSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
