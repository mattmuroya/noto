import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import noteRouter from './routes/notes';

// INIT APPLICATION
const app = express();

// REQUEST PROCESSORS
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

export default app;
