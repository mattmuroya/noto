import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validator';
import { newNoteSchema, updateNoteSchema } from '../schemas/note.schema';
import {
  getNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
} from '../controllers/note.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getNotes);
router.post('/', validate(newNoteSchema), createNote);
router.get('/:id', getNote);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;
