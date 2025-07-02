import { Request, Response } from 'express';
import { Registration, LoginCredentials } from '../types';
import { createUser } from '../services/user.service';
import {
  loginUser,
  rotateRefreshToken,
  logoutUser,
} from '../services/auth.service';

export const register = async (
  req: Request<unknown, unknown, Registration>,
  res: Response
) => {
  const { email, password } = req.body;
  const user = await createUser(email, password);
  res.status(201).json({ message: 'User registered', user });
};

export const login = async (
  req: Request<unknown, unknown, LoginCredentials>,
  res: Response
) => {
  const loginCredentials = req.body;
  const { accessToken, refreshToken } = await loginUser(loginCredentials);
  res
    .cookie('noto_refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: refreshToken.duration,
    })
    .status(200)
    .json({ message: 'Login successful', token: accessToken.token });
};

export const refresh = async (req: Request, res: Response) => {
  const token: string = req.cookies.noto_refreshToken;
  const { accessToken, refreshToken } = await rotateRefreshToken(token);
  res
    .cookie('noto_refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: refreshToken.duration,
    })
    .status(200)
    .json({ message: 'Refresh successful', token: accessToken.token });
};

export const logout = async (req: Request, res: Response) => {
  const token: string = req.cookies.refreshToken;
  if (token) await logoutUser(token);
  res.clearCookie('noto_refreshToken').status(204).end();
};
