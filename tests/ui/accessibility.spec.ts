import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@fixtures/test';
import { CUSTOMER, PRODUCTS } from '@data/products';

const WCAG_A_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function violations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_A_AA).analyze();
  return results.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}`);
}

test.describe('Accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  test(
    'should have no violations on the login page',
    { tag: ['@a11y', '@regression'] },
    async ({ page, loginPage }) => {
      await loginPage.open();
      expect(await violations(page)).toEqual([]);
    },
  );

  test(
    'should have no violations on the products page',
    { tag: ['@a11y', '@regression'] },
    async ({ page, loginAs }) => {
      await loginAs('standard_user');
      expect(await violations(page)).toEqual([]);
    },
  );

  test(
    'should have no violations on the cart and checkout pages',
    { tag: ['@a11y', '@regression'] },
    async ({ page, loginAs, inventoryPage, cartPage, checkoutInfoPage }) => {
      await loginAs('standard_user');
      await inventoryPage.add(PRODUCTS.backpack.slug);
      await inventoryPage.openCart();
      expect(await violations(page)).toEqual([]);
      await cartPage.checkout();
      await checkoutInfoPage.fill(CUSTOMER);
      expect(await violations(page)).toEqual([]);
    },
  );
});
