import { test, expect } from '@fixtures/test';
import { ALL_PRODUCTS, PRODUCTS } from '@data/products';
import type { SortOption } from '@support/types';

const NAME_SORTS: { option: SortOption; label: string; compare: (a: string, b: string) => number }[] = [
  { option: 'az', label: 'name A to Z', compare: (a, b) => a.localeCompare(b) },
  { option: 'za', label: 'name Z to A', compare: (a, b) => b.localeCompare(a) },
];

const PRICE_SORTS: { option: SortOption; label: string; compare: (a: number, b: number) => number }[] = [
  { option: 'lohi', label: 'price low to high', compare: (a, b) => a - b },
  { option: 'hilo', label: 'price high to low', compare: (a, b) => b - a },
];

test.describe('Products', () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs('standard_user');
  });

  test('should list six products with name, price and own image', { tag: ['@smoke'] }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    expect((await inventoryPage.names()).sort()).toEqual(ALL_PRODUCTS.map((p) => p.name).sort());
    expect(new Set(await inventoryPage.imageSources()).size).toBe(6);
  });

  for (const { option, label, compare } of NAME_SORTS) {
    test(`should sort products by ${label}`, { tag: ['@regression'] }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const names = await inventoryPage.names();
      expect(names).toEqual([...names].sort(compare));
    });
  }

  for (const { option, label, compare } of PRICE_SORTS) {
    test(`should sort products by ${label}`, { tag: ['@regression'] }, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);
      const prices = await inventoryPage.prices();
      expect(prices).toEqual([...prices].sort(compare));
    });
  }

  test(
    'should open a product with the same name and price',
    { tag: ['@regression'] },
    async ({ inventoryPage, productPage }) => {
      await inventoryPage.openProduct(PRODUCTS.backpack.name);
      await expect(productPage.name).toHaveText(PRODUCTS.backpack.name);
      await expect(productPage.price).toHaveText(`$${PRODUCTS.backpack.price}`);
      await productPage.backToProducts();
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );
});
