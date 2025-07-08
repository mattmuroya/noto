import { APIRequestContext } from '@playwright/test';
import { randomUUID } from 'crypto';

export const registerAndLoginNewUser = async (request: APIRequestContext) => {
  const email = `user+${randomUUID()}@example.com`;
  const password = 'Qwerty1234!';

  const registerRes = await request.post('/api/auth/register', {
    data: { email, password },
  });
  const registerBody = await registerRes.json();

  const loginRes = await request.post('/api/auth/login', {
    data: { email, password },
  });
  const loginBody = await loginRes.json();

  return {
    userId: registerBody.user.id,
    accessToken: loginBody.token,
  };
};
