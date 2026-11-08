import { test, expect } from '@fixtures/test';
import { LOGIN_ERRORS, USERS } from '@data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    'should log in standard_user and show the products page',
    { tag: ['@smoke'] },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );

  const invalidLogins = [
    { title: 'locked-out user', username: USERS.lockedOut, password: undefined, error: LOGIN_ERRORS.lockedOut },
    { title: 'wrong password', username: USERS.standard, password: 'wrong_password', error: LOGIN_ERRORS.noMatch },
    { title: 'empty username', username: '', password: 'secret_sauce', error: LOGIN_ERRORS.usernameRequired },
    { title: 'empty password', username: USERS.standard, password: '', error: LOGIN_ERRORS.passwordRequired },
  ];

  for (const { title, username, password, error } of invalidLogins) {
    test(`should show error for ${title}`, { tag: ['@negative', '@regression'] }, async ({ page, loginPage }) => {
      await loginPage.login(username, password);
      await expect(loginPage.error).toHaveText(error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('should clear the error message with the close button', { tag: ['@regression'] }, async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut);
    await loginPage.errorClose.click();
    await expect(loginPage.error).toBeHidden();
  });

  test('should send a visitor without session back to login', { tag: ['@negative'] }, async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in.");
  });

  test(
    'should log in performance_glitch_user despite the slow response',
    { tag: ['@regression'] },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(USERS.performanceGlitch);
      await page.waitForURL('**/inventory.html', { timeout: 15_000 });
      await expect(inventoryPage.items).toHaveCount(6);
    },
  );
});
