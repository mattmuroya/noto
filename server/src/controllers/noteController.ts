import { Request, Response } from 'express';
import noteService from '../services/noteService';

const getNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await noteService.getNotes();
    res.json(notes);
  } catch {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = await noteService.createNote(title, content);
    res.status(201).json(note);
  } catch {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await noteService.updateNote(id, title, content);
    res.json(note);
  } catch {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await noteService.deleteNote(id);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export default { getNotes, createNote, updateNote, deleteNote };
