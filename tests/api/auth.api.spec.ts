import { test, expect } from '@fixtures/api';
import { ADMIN_CREDENTIALS } from '@data/bookings';

test.describe('API - Auth', () => {
  test('should return a token for valid credentials', { tag: ['@smoke', '@api'] }, async ({ authClient }) => {
    const response = await authClient.createToken(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
    expect(response.status()).toBe(200);
    expect((await response.json()).token).toMatch(/^[a-f0-9]{15}$/);
  });

  test('should not return a token for a wrong password', { tag: ['@negative', '@api'] }, async ({ authClient }) => {
    const response = await authClient.createToken(ADMIN_CREDENTIALS.username, 'wrong-password');
    const body = await response.json();
    expect(body).not.toHaveProperty('token');
    expect(body.reason).toBe('Bad credentials');
  });
});
