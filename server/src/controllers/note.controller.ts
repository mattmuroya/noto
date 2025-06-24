import { Request, Response } from 'express';
import * as noteService from '../services/note.service';

export const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await noteService.getNotes();
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = await noteService.createNote(title, content);
    res.status(201).json(note);
  } catch {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await noteService.updateNote(id, title, content);
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await noteService.deleteNote(id);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
