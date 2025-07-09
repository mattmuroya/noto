import { test, expect } from '@playwright/test';
import { registerAndLoginNewUser } from '../../testUtils';

test.describe('DELETE: /api/notes/:id', () => {
  test('deletes note created by authenticated user', async ({ request }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const title = 'Hello, World!';
    const content = "It's dangerous to go alone! Take this.";

    const createRes = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const res = await request.delete(`api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(204);

    const getRes = await request.get('/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getBody = await getRes.json();
    expect(getBody).toHaveLength(0);
  });

  test('rejects deleting note with no authenticated user', async ({
    request,
  }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const title = 'Hello, World!';
    const content = "It's dangerous to go alone! Take this.";

    const createRes = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const res = await request.delete(`api/notes/${noteId}`);

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'No token provided');
  });

  test('returns 404 if wrong authenticated user', async ({ request }) => {
    const { accessToken: token1 } = await registerAndLoginNewUser(request);

    const title = 'Hello, World!';
    const content = "It's dangerous to go alone! Take this.";

    const createRes = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: `Bearer ${token1}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    const { accessToken: token2 } = await registerAndLoginNewUser(request);

    const res = await request.delete(`api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Not Found');
  });

  test('returns 404 if note does not exist', async ({ request }) => {
    const { accessToken: token } = await registerAndLoginNewUser(request);

    const title = 'Hello, World!';
    const content = "It's dangerous to go alone! Take this.";

    const createRes = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: `Bearer ${token}` },
    });
    const createBody = await createRes.json();
    const noteId = createBody.note.id;

    await request.delete(`api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await request.delete(`api/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Not Found');
  });
});
