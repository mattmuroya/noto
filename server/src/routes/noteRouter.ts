import { Router } from 'express';
import { validate } from '../middleware/validator';
import noteController from '../controllers/noteController';
import { newNote } from '../schemas/note.schema';

const noteRouter = Router();

noteRouter.get('/', noteController.getNotes);
noteRouter.post('/', validate(newNote), noteController.createNote);
noteRouter.put('/:id', validate(newNote), noteController.updateNote);
noteRouter.delete('/:id', noteController.deleteNote);

export default noteRouter;
