import { test, expect } from '@fixtures/test';
import { ALL_PRODUCTS, PRODUCTS } from '@data/products';

const { backpack, bikeLight } = PRODUCTS;

test.describe('Cart', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard_user');
  });

  test('should add one item and show badge 1', { tag: ['@smoke'] }, async ({ inventoryPage }) => {
    await inventoryPage.add(backpack.slug);
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton(backpack.slug)).toBeVisible();
  });

  test('should remove an item from the product list', { tag: ['@regression'] }, async ({ inventoryPage }) => {
    await inventoryPage.add(backpack.slug);
    await inventoryPage.removeButton(backpack.slug).click();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('should add all six products', { tag: ['@regression'] }, async ({ inventoryPage }) => {
    await inventoryPage.add(...ALL_PRODUCTS.map((p) => p.slug));
    await expect(inventoryPage.cartBadge).toHaveText('6');
  });

  test(
    'should list added items with quantity 1 in the cart',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.add(backpack.slug, bikeLight.slug);
      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText([backpack.name, bikeLight.name]);
      await expect(cartPage.quantities).toHaveText(['1', '1']);
    },
  );

  test('should remove an item on the cart page', { tag: ['@regression'] }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.add(backpack.slug, bikeLight.slug);
    await inventoryPage.openCart();
    await cartPage.remove(backpack.slug);
    await expect(cartPage.itemNames).toHaveText([bikeLight.name]);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  test(
    'should return to products with Continue Shopping',
    { tag: ['@regression'] },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.openCart();
      await cartPage.continueShopping();
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );
});
