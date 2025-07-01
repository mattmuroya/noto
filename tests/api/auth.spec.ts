import { test, expect } from '@playwright/test';

test.describe('/api/auth', () => {
  test('/register should register a new user', async ({ request }) => {
    const email = 'the@guy.com';
    const password = 'TheRealGuy1!';

    const res = await request.post('/api/auth/register', {
      data: {
        email,
        password,
      },
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();

    expect(body).toHaveProperty('message', 'User registered');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email', email);
  });

  // test('should log in a user and return access token and refresh cookie', async ({
  //   request,
  // }) => {
  //   const res = await request.post('/auth/login', {
  //     data: {
  //       email: 'test@example.com',
  //       password: 'StrongPass123!',
  //     },
  //   });

  //   expect(res.status()).toBe(200);
  //   expect(res.headers()['set-cookie']).toContain('refreshToken');
  //   const body = await res.json();
  //   expect(body).toHaveProperty('accessToken');
  // });
});
