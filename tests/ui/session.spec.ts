import { test, expect } from '@fixtures/test';
import { PRODUCTS } from '@data/products';

test.describe('Session and menu', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard_user');
  });

  test('should log out and block the Back button', { tag: ['@smoke'] }, async ({ page, sideMenu, loginPage }) => {
    await sideMenu.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await page.goBack();
    await expect(loginPage.error).toContainText('when you are logged in');
  });

  test(
    'should clear the cart badge with Reset App State',
    { tag: ['@regression'] },
    async ({ inventoryPage, sideMenu }) => {
      await inventoryPage.add(PRODUCTS.backpack.slug);
      await sideMenu.resetAppState();
      await expect(inventoryPage.cartBadge).toBeHidden();
    },
  );

  test('should link About to the Sauce Labs website', { tag: ['@regression'] }, async ({ sideMenu }) => {
    await sideMenu.openButton.click();
    await expect(sideMenu.aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
  });
});
