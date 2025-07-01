import { Request, Response } from 'express';
// import * as noteService from '../services/note.service';
import {
  getNotes as getNotesService,
  createNote as createNoteService,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
} from '../services/note.service';

export const getNotes = async (_req: Request, res: Response) => {
  const notes = await getNotesService();
  res.json(notes);
};

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const note = await createNoteService(title, content);
  res.status(201).json(note);
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const note = await updateNoteService(id, title, content);
  res.json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteNoteService(id);
  res.status(204).end();
};
