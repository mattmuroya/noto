import { Router } from 'express';
import { validate } from '../middleware/validator';
import { registrationSchema } from '../schemas/auth.schema';
import { register } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registrationSchema), register);

export default router;
