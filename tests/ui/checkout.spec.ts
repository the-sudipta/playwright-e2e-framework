import { test, expect, knownDefect } from '@fixtures/test';
import { CUSTOMER, MISSING_FIELD_CASES, PRODUCTS, TAX_RATE } from '@data/products';
import { KNOWN_DEFECTS } from '@data/known-defects';

const { backpack, bikeLight, boltTShirt, fleeceJacket, redTShirt, onesie } = PRODUCTS;
const round2 = (value: number) => Math.round(value * 100) / 100;

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard_user');
  });

  test(
    'should complete an order and empty the cart',
    { tag: ['@smoke'] },
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
      await inventoryPage.add(backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(CUSTOMER);
      await checkoutOverviewPage.finish();
      await expect(checkoutCompletePage.header).toHaveText('Thank you for your order!');
      await expect(checkoutCompletePage.cartBadge).toBeHidden();
    },
  );

  for (const { field, error } of MISSING_FIELD_CASES) {
    test(`should require ${field}`, { tag: ['@negative'] }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
      await inventoryPage.add(backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit({ ...CUSTOMER, [field]: '' });
      await expect(checkoutInfoPage.error).toHaveText(error);
    });
  }

  test(
    'should calculate item total, 8% tax and total',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
      const items = [backpack, onesie, boltTShirt];
      await inventoryPage.add(...items.map((p) => p.slug));
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(CUSTOMER);
      const subtotal = round2(items.reduce((sum, p) => sum + p.price, 0));
      expect(await checkoutOverviewPage.amount(checkoutOverviewPage.itemTotal)).toBe(subtotal);
      expect(await checkoutOverviewPage.amount(checkoutOverviewPage.tax)).toBe(round2(subtotal * TAX_RATE));
      expect(await checkoutOverviewPage.amount(checkoutOverviewPage.total)).toBe(round2(subtotal * (1 + TAX_RATE)));
    },
  );

  test(
    'should keep the cart when the order is cancelled',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
      await inventoryPage.add(backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(CUSTOMER);
      await checkoutOverviewPage.cancel();
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.cartBadge).toHaveText('1');
    },
  );

  test(
    'should show the item total with two decimals',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
      knownDefect(KNOWN_DEFECTS.unroundedItemTotal);
      await inventoryPage.sortBy('lohi');
      await inventoryPage.add(bikeLight.slug, boltTShirt.slug, redTShirt.slug, backpack.slug, fleeceJacket.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(CUSTOMER);
      await expect(checkoutOverviewPage.itemTotal).toHaveText(/^Item total: \$\d+\.\d{2}$/);
    },
  );
});
