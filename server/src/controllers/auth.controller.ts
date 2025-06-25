import { Request, Response } from 'express';
import { Registration } from '../types';
import { createUser } from '../services/user.service';

export const register = async (
  req: Request<unknown, unknown, Registration>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email already in use') {
      res.status(409).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
