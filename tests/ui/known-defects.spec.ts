import { test, expect, knownDefect } from '@fixtures/test';
import { ALL_PRODUCTS, CUSTOMER, PRODUCTS } from '@data/products';
import { KNOWN_DEFECTS } from '@data/known-defects';
import { USERS } from '@data/users';

// problem_user and error_user ship with intentional defects. Each test states the correct behaviour and is
// marked test.fail with the bug report it belongs to; if a defect disappears the test turns into an
// "unexpected pass" and the report gets retested.

test.describe('Known defects - problem_user', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs(USERS.problem);
  });

  test('should show a different image for every product', { tag: ['@regression'] }, async ({ inventoryPage }) => {
    knownDefect(KNOWN_DEFECTS.sameImageForAllProducts);
    expect(new Set(await inventoryPage.imageSources()).size).toBe(6);
  });

  test('should sort products by name Z to A', { tag: ['@regression'] }, async ({ inventoryPage }) => {
    knownDefect(KNOWN_DEFECTS.sortingHasNoEffect);
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('should add all six products to the cart', { tag: ['@regression'] }, async ({ inventoryPage }) => {
    knownDefect(KNOWN_DEFECTS.addToCartBroken);
    await inventoryPage.add(...ALL_PRODUCTS.map((p) => p.slug));
    await expect(inventoryPage.cartBadge).toHaveText('6', { timeout: 2_000 });
  });

  test('should open the product that was clicked', { tag: ['@regression'] }, async ({ inventoryPage, productPage }) => {
    knownDefect(KNOWN_DEFECTS.wrongProductPage);
    await inventoryPage.openProduct(PRODUCTS.backpack.name);
    await expect(productPage.name).toHaveText(PRODUCTS.backpack.name, { timeout: 2_000 });
  });

  test(
    'should keep the last name typed at checkout',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
      knownDefect(KNOWN_DEFECTS.lastNameOverwritesFirst);
      await inventoryPage.add(PRODUCTS.backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.type(CUSTOMER);
      await expect(checkoutInfoPage.lastName).toHaveValue(CUSTOMER.lastName, { timeout: 2_000 });
    },
  );
});

test.describe('Known defects - error_user', () => {
  test(
    'should complete an order',
    { tag: ['@regression'] },
    async ({ loginAs, inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {
      knownDefect(KNOWN_DEFECTS.finishDoesNothing);
      await loginAs(USERS.error);
      await inventoryPage.add(PRODUCTS.backpack.slug);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(CUSTOMER);
      await checkoutOverviewPage.finish();
      await expect(checkoutCompletePage.header).toHaveText('Thank you for your order!', { timeout: 2_000 });
    },
  );
});
