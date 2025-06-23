import { Router } from 'express';
import noteController from '../controllers/noteController';

const noteRouter = Router();

noteRouter.get('/', noteController.getNotes);
noteRouter.post('/', noteController.createNote);
noteRouter.put('/:id', noteController.updateNote);
noteRouter.delete('/:id', noteController.deleteNote);

export default noteRouter;
