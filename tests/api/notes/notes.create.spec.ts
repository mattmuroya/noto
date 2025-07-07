import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('POST: /api/notes/', () => {
  test('creates new note associated with authenticated user', async ({
    request,
  }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const loginRes = await request.post('/api/auth/login', {
      data: { email, password },
    });

    const loginBody = await loginRes.json();
    const token = loginBody.token;

    const title = 'New Note';
    const content = 'Hello, World!';

    const res = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body).toHaveProperty('message', 'Note created successfully');
    expect(body).toHaveProperty('note');
    expect(body.note.title).toBe(title);
    expect(body.note.content).toBe(content);
    expect(body.note.userId).toBeDefined();
    expect(body.note.createdAt).toBeDefined();
    expect(body.note.updatedAt).toBeDefined();
  });

  test('rejects creating note with missing authorization token', async ({
    request,
  }) => {
    const title = 'New Note';
    const content = 'Hello, World!';

    const res = await request.post('/api/notes', {
      data: { title, content },
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'No token provided');
  });

  test('rejects creating note with invalid authorization token', async ({
    request,
  }) => {
    const title = 'New Note';
    const content = 'Hello, World!';

    const res = await request.post('/api/notes', {
      data: { title, content },
      headers: { Authorization: 'Bearer invalid_auth_token`' },
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Invalid or expired token');
  });

  test('rejects creating note with missing title', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const loginRes = await request.post('/api/auth/login', {
      data: { email, password },
    });

    const loginBody = await loginRes.json();
    const token = loginBody.token;

    const content = 'Hello, World!';

    const res = await request.post('/api/notes', {
      data: { content },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
  });

  test('rejects creating note with missing content', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const loginRes = await request.post('/api/auth/login', {
      data: { email, password },
    });

    const loginBody = await loginRes.json();
    const token = loginBody.token;

    const title = 'New Note';

    const res = await request.post('/api/notes', {
      data: { title },
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
  });
});
