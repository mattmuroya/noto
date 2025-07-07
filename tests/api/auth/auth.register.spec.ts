import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('/api/auth/register', () => {
  test('registers new user', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('message', 'User registered');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email', email);
  });

  test('rejects existing email', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    await request.post('/api/auth/register', {
      data: { email, password },
    });

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Email already in use');
  });

  test('rejects missing email', async ({ request }) => {
    const password = 'Qwerty1234!';

    const res = await request.post('/api/auth/register', {
      data: { password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('email');
    expect(body.details.fieldErrors.email).toContain('Required');
  });

  test('rejects malformed email', async ({ request }) => {
    const email = 'malformed.email.com';
    const password = 'Qwerty1234!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('email');
    expect(body.details.fieldErrors.email).toContain('Invalid email');
  });

  test('rejects missing password', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;

    const res = await request.post('/api/auth/register', {
      data: { email },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain('Required');
  });

  test('rejects password less than 8 characters', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qw1!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain(
      'Password must be at least 8 characters'
    );
  });

  test('rejects password without uppercase letter', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'qwerty1234!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain(
      'Password must contain at least one uppercase letter'
    );
  });

  test('rejects password without lowercase letter', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'QWERTY1234!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain(
      'Password must contain at least one lowercase letter'
    );
  });

  test('rejects password without number', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'QwertyQwerty!';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain(
      'Password must contain at least one number'
    );
  });

  test('rejects password without special character', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234';

    const res = await request.post('/api/auth/register', {
      data: { email, password },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'Validation error');
    expect(body).toHaveProperty('details');
    expect(body.details).toHaveProperty('fieldErrors');
    expect(body.details.fieldErrors).toHaveProperty('password');
    expect(body.details.fieldErrors.password).toContain(
      'Password must contain at least one special character: !@#$%^&*'
    );
  });
});
