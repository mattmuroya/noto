import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validator';
import { newNoteSchema } from '../schemas/note.schema';
import {
  getAll,
  create,
  getOne,
  // updateNote,
  // deleteNote,
} from '../controllers/note.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/', validate(newNoteSchema), create);
router.get('/:id', getOne);

// router.put('/:id', validate(newNoteSchema), updateNote);
// router.delete('/:id', deleteNote);

export default router;
