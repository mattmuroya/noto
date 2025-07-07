import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('/api/auth/logout', () => {
  test('revokes user session', async ({ request }) => {
    const email = `user+${randomUUID()}@example.com`;
    const password = 'Qwerty1234!';

    // Register
    await request.post('/api/auth/register', {
      data: { email, password },
    });

    // Login/automatically store cookie
    await request.post('/api/auth/login', {
      data: { email, password },
    });

    // Rotate/send stored cookie
    const res = await request.post('/api/auth/logout');

    expect(res.status()).toBe(204);

    const headers = res.headers();
    expect(headers['set-cookie']).toBe(
      'noto_refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );
  });
});
