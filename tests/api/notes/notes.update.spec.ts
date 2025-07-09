import { test, expect } from '@playwright/test';
import { registerAndLoginNewUser } from '../../testUtils';

test.describe('PUT: /api/notes/:id', () => {
  test('updates an existing note created by authenticated user', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const updatedTitle = 'Goodbye, World!';
    const updatedContent = 'One does not simply walk into Mordor!';

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(200);
    const updatedNote = await res.json();
    expect(updatedNote).toHaveProperty('title', updatedTitle);
    expect(updatedNote).toHaveProperty('content', updatedContent);
  });

  test('rejects updating note if no authenticated user', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const updatedTitle = 'Goodbye, World!';
    const updatedContent = 'One does not simply walk into Mordor!';

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'No token provided');
  });

  test('returns 404 if wrong authenticated user', async ({ request }) => {
    const { accessToken: token1 } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token1}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const updatedTitle = 'Goodbye, World!';
    const updatedContent = 'One does not simply walk into Mordor!';

    const { accessToken: token2 } = await registerAndLoginNewUser(request);

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
      headers: {
        Authorization: `Bearer ${token2}`,
      },
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Not Found');
  });

  test('rejects updating if note does not exist', async ({ request }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    await request.delete(`api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedTitle = 'Goodbye, World!';
    const updatedContent = 'One does not simply walk into Mordor!';

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        title: updatedTitle,
        content: updatedContent,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Not Found');
  });

  test('rejects updating note if missing title', async ({ request }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const updatedContent = 'One does not simply walk into Mordor!';

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        content: updatedContent,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body.details.fieldErrors.title).toContain('Required');
  });

  test('rejects updating note if missing content', async ({ request }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const createRes = await request.post('/api/notes', {
      data: {
        title: 'Hello, World!',
        content: "It's dangerous to go alone! Take this.",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const updatedTitle = 'Goodbye, World!';

    const res = await request.put(`/api/notes/${noteId}`, {
      data: {
        title: updatedTitle,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body.details.fieldErrors.content).toContain('Required');
  });
});
