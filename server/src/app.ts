import express from 'express';
import noteRouter from './routes/notes';

// INIT APPLICATION
const app = express();

// REQUEST PROCESSORS
app.use(express.json());

// ROUTES
app.use('/api/notes', noteRouter);

export default app;
