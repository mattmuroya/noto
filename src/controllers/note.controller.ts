import { Request, Response } from 'express';
import { HttpStatusCode } from '../errors/HttpError';
import {
  getNotesByUserId,
  createNewNote,
  getNoteById,
  updateNoteById,
  deleteNoteById,
} from '../services/note.service';
import { NewNote, UpdateNote } from '../types/note.types';

export const getNotes = async (req: Request, res: Response) => {
  const userId = req.user!.id; // user property guaranteed by requireAuth middleware
  const userNotes = await getNotesByUserId(userId);
  res.status(HttpStatusCode.OK200).json(userNotes);
};

export const createNote = async (
  req: Request<unknown, unknown, NewNote>,
  res: Response
) => {
  const note = req.body;
  const userId = req.user!.id;
  const createdNote = await createNewNote(note, userId);
  res
    .status(HttpStatusCode.Created201)
    .json({ message: 'Note created successfully', note: createdNote });
};

export const getNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user!.id;
  const note = await getNoteById(noteId, userId);
  res.status(HttpStatusCode.OK200).json(note);
};

export const updateNote = async (
  req: Request<{ id: string }, unknown, UpdateNote>,
  res: Response
) => {
  const updateNote = req.body;
  const noteId = req.params.id;
  const userId = req.user!.id;
  const updatedNote = await updateNoteById(noteId, updateNote, userId);
  res.status(HttpStatusCode.OK200).json(updatedNote);
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user!.id;
  await deleteNoteById(noteId, userId);
  res.status(HttpStatusCode.NoContent204).end();
};
