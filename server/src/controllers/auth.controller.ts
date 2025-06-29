import { Request, Response } from 'express';
import { Registration, LoginCredentials } from '../types';
import { createUser } from '../services/user.service';
import { loginUser, rotateRefreshToken } from '../services/auth.service';

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

export const login = async (
  req: Request<unknown, unknown, LoginCredentials>,
  res: Response
) => {
  try {
    const loginCredentials = req.body;
    const { accessToken, refreshToken } = await loginUser(loginCredentials);
    res
      .cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: refreshToken.duration,
      })
      .status(200)
      .json({ message: 'Login successful', accessToken: accessToken.token });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === 'Invalid email or password'
    ) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token: string = req.cookies.refreshToken;

    // if (!refreshToken) {
    //   res.status(401).json({ error: 'No refresh token provided' });
    //   return;
    // }

    const { accessToken, refreshToken } = await rotateRefreshToken(token);

    res
      .cookie('refreshToken', refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: refreshToken.duration,
      })
      .status(200)
      .json({ message: 'Refresh successful', accessToken: accessToken.token });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Session not found') {
      res.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
};
