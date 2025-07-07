import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('/api/auth/login', () => {
  test('logs in existing user and sends access and refresh tokens', async ({
    request,
  }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const res = await request.post('/api/auth/login', {
      data: { email, password },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('message', 'Login successful');
    expect(body).toHaveProperty('token');

    const headers = res.headers();
    expect(headers).toHaveProperty('set-cookie');
    expect(headers['set-cookie']).toContain('noto_refreshToken');
  });

  test('rejects missing email', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const res = await request.post('/api/auth/login', {
      data: { password },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body.details.fieldErrors.email).toContain('Required');
  });

  test('rejects malformed email', async ({ request }) => {
    const email = 'bad.email@.com';
    const password = 'Qwerty1234!';

    const res = await request.post('/api/auth/login', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body.details.fieldErrors.email).toContain('Invalid email');
  });

  test('rejects email not found in db', async ({ request }) => {
    const email = 'nonexistent.user@example.com';
    const password = 'Qwerty1234!';

    const res = await request.post('/api/auth/login', {
      data: { email, password },
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Email not found');
  });

  test('rejects missing password', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const res = await request.post('/api/auth/login', {
      data: { email },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body.details.fieldErrors.password).toContain('Required');
  });

  test('rejects invalid password', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const res = await request.post('/api/auth/login', {
      data: { email, password: 'WrongPassword1234!' },
    });

    expect(res.status()).toBe(401);

    const body = await res.json();
    expect(body).toHaveProperty('error', 'Invalid password');
  });
});
