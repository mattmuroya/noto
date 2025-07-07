import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('/api/auth/refresh', () => {
  test('rotates valid refresh token', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    // Register
    await request.post('/api/auth/register', {
      data: { email, password },
    });

    // Login/automatically store cookie
    const loginReq = await request.post('/api/auth/login', {
      data: { email, password },
    });
    const oldCookie = loginReq.headers()['set-cookie'];

    // Rotate/send stored cookie
    const res = await request.post('/api/auth/refresh');

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('message', 'Refresh successful');
    expect(body).toHaveProperty('token');

    const headers = res.headers();
    expect(headers['set-cookie']).toContain('noto_refreshToken');

    expect(res.headers()['set-cookie']).not.toBe(oldCookie);
  });
});
