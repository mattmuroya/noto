import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import noteRouter from './routes/notes';

import { errorHandler } from './middleware/errorHandler';

// INIT APPLICATION
const app = express();

const envPath = process.env.NODE_ENV == 'test' ? './.env.test' : './.env';
dotenv.config({ path: envPath });

// REQUEST PROCESSORS
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/ready', async (_req, res) => {
  res.status(200).end();
});
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

// ERROR HANDLER
app.use(errorHandler);

export default app;
