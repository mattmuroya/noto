import { Router } from 'express';
import { validate } from '../middleware/validator';
import { newNoteSchema } from '../schemas/note.schema';
import * as noteController from '../controllers/note.controller';

const router = Router();

router.get('/', noteController.getNotes);
router.post('/', validate(newNoteSchema), noteController.createNote);
router.put('/:id', validate(newNoteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
