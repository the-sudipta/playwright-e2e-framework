import { test, expect } from '@fixtures/test';
import { PRODUCTS } from '@data/products';

// Visual comparison of the product image regions. Text is left out on purpose: fonts render differently on
// Windows and Linux, product images do not, so one baseline per browser works locally and in CI.

test.describe('Visual comparison', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines are kept for Chromium only');

  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard_user');
  });

  test('products page images should match the baseline', { tag: ['@visual'] }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    await expect(inventoryPage.itemImages.first()).toHaveScreenshot('products-first-image.png');
    await expect(inventoryPage.itemImages.last()).toHaveScreenshot('products-last-image.png');
  });

  test('product detail image should match the baseline', { tag: ['@visual'] }, async ({ page, inventoryPage }) => {
    await inventoryPage.openProduct(PRODUCTS.fleeceJacket.name);
    await expect(page.locator('.inventory_details_img')).toHaveScreenshot('product-detail-image.png');
  });
});
