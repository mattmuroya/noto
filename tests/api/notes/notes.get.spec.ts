import { test, expect } from '@playwright/test';
import { registerAndLoginNewUser } from '../../testUtils';

test.describe('GET: /api/notes/', () => {
  test('retrieves list of notes created by authenticated user', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);
    for (const data of [
      { title: 'Note 1', content: 'Hello, World!' },
      { title: 'Note 2', content: "It's dangerous to go alone! Take this." },
      { title: 'Note 3', content: 'One does not simply walk into Mordor.' },
    ]) {
      await request.post('/api/notes', {
        data,
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    const res = await request.get('/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);
    const notes = await res.json();
    expect(notes).toHaveLength(3);
    expect(
      notes.some((n) => n.title == 'Note 1' && n.content == 'Hello, World!')
    ).toBe(true);
  });

  test('does not retrieve notes create by other user', async ({ request }) => {
    const { accessToken: token1 } = await registerAndLoginNewUser(request);
    for (const data of [
      { title: 'Note 1', content: 'Hello, World!' },
      { title: 'Note 2', content: "It's dangerous to go alone! Take this." },
      { title: 'Note 3', content: 'One does not simply walk into Mordor.' },
    ]) {
      await request.post('/api/notes', {
        data,
        headers: { Authorization: `Bearer ${token1}` },
      });
    }

    const { accessToken: token2 } = await registerAndLoginNewUser(request);
    for (const data of [
      { title: 'Note 1', content: 'Goodbye, World!' },
      { title: 'Note 2', content: 'Our princess is in another castle!' },
      { title: 'Note 3', content: 'But what about second breakfast?' },
    ]) {
      await request.post('/api/notes', {
        data,
        headers: { Authorization: `Bearer ${token2}` },
      });
    }

    const res = await request.get('/api/notes', {
      headers: {
        Authorization: `Bearer ${token2}`,
      },
    });

    expect(res.status()).toBe(200);
    const notes = await res.json();
    expect(notes).toHaveLength(3);
    expect(
      notes.some((n) => n.title == 'Note 1' && n.content == 'Goodbye, World!')
    ).toBe(true);
    expect(
      notes.some((n) => n.title == 'Note 1' && n.content == 'Hello, World!')
    ).not.toBe(true);
  });

  test('retrieves an empty list if user has no notes', async ({ request }) => {
    const { accessToken: token1 } = await registerAndLoginNewUser(request);
    for (const data of [
      { title: 'Note 1', content: 'Hello, World!' },
      { title: 'Note 2', content: "It's dangerous to go alone! Take this." },
      { title: 'Note 3', content: 'One does not simply walk into Mordor.' },
    ]) {
      await request.post('/api/notes', {
        data,
        headers: { Authorization: `Bearer ${token1}` },
      });
    }

    const { accessToken: token2 } = await registerAndLoginNewUser(request);

    const res = await request.get('/api/notes', {
      headers: { Authorization: `Bearer ${token2}` },
    });

    expect(res.status()).toBe(200);
    const notes = await res.json();
    expect(notes).toHaveLength(0);
  });
});

test.describe('GET: /api/notes/:id', () => {
  test('retrieves single note created by authenticated user', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: { title: 'Note 1', content: 'Hello, World!' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const createdNote = await createRes.json();
    const id = createdNote.note.id;

    const res = await request.get(`/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);
    const note = await res.json();
    expect(note).toHaveProperty('title');
    expect(note.title).toBe('Note 1');
  });

  test('rejects retrieving note if no authentication provided', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: { title: 'Note 1', content: 'Hello, World!' },
      headers: { Authorization: `Bearer ${token}` },
    });

    const createdNote = await createRes.json();
    const id = createdNote.note.id;

    const res = await request.get(`/api/notes/${id}`);

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('No token provided');
  });

  test('rejects retrieving note if wrong authenticated user', async ({
    request,
  }) => {
    const { accessToken: token1 } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: { title: 'Note 1', content: 'Hello, World!' },
      headers: { Authorization: `Bearer ${token1}` },
    });

    const createBody = await createRes.json();
    const id = createBody.note.id;

    const { accessToken: token2 } = await registerAndLoginNewUser(request);

    const res = await request.get(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Not Found');
  });
});
