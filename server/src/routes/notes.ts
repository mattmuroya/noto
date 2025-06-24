import { Router } from 'express';
import { validate } from '../middleware/validator';
import { newNote } from '../schemas/note.schema';
import * as noteRouter from '../controllers/note.controller';

const router = Router();

router.get('/', noteRouter.getNotes);
router.post('/', validate(newNote), noteRouter.createNote);
router.put('/:id', validate(newNote), noteRouter.updateNote);
router.delete('/:id', noteRouter.deleteNote);

export default router;
