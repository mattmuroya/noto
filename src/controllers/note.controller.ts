import { Request, Response } from 'express';
import { HttpStatusCode } from '../errors/HttpError';
import {
  getNotesByUserId,
  createNote,
  getNoteById,
} from '../services/note.service';
import { NewNote } from '../types/note.types';

// export const updateNote = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { title, content } = req.body;
//   const note = await updateNoteService(id, title, content);
//   res.json(note);
// };

// export const deleteNote = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await deleteNoteService(id);
//   res.status(204).end();
// };

export const getAll = async (req: Request, res: Response) => {
  const userId = req.user!.id; // user property guaranteed by requireAuth middleware
  const userNotes = await getNotesByUserId(userId);
  res.status(HttpStatusCode.OK200).json(userNotes);
};

export const create = async (
  req: Request<unknown, unknown, NewNote>,
  res: Response
) => {
  const note = req.body;
  const userId = req.user!.id;
  const createdNote = await createNote(note, userId);
  res
    .status(HttpStatusCode.Created201)
    .json({ message: 'Note created successfully', note: createdNote });
};

export const getOne = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user!.id;
  const note = await getNoteById(noteId, userId);
  res.status(HttpStatusCode.OK200).json(note);
};
