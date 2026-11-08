import type { Locator, Page } from '@playwright/test';
import type { SortOption } from '@support/types';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemImages: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemImages = page.locator('.inventory_item_img img');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  async open(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async names(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map((text) => Number(text.replace('$', '')));
  }

  async imageSources(): Promise<string[]> {
    return this.itemImages.evaluateAll((images) => images.map((img) => img.getAttribute('src') ?? ''));
  }

  addButton(slug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${slug}`);
  }

  removeButton(slug: string): Locator {
    return this.page.getByTestId(`remove-${slug}`);
  }

  // If a click lands while the list is still rendering, the button does not switch to "Remove": click once more.
  // A button that never works (a real defect) is left as it is, so the test still sees the defect.
  private async addOne(slug: string): Promise<void> {
    await this.addButton(slug).click();
    const switched = await this.removeButton(slug)
      .waitFor({ timeout: 1_500 })
      .then(
        () => true,
        () => false,
      );
    if (!switched) await this.addButton(slug).click();
  }

  async add(...slugs: string[]): Promise<void> {
    for (const slug of slugs) await this.addOne(slug);
  }

  async openProduct(name: string): Promise<void> {
    await this.itemNames.filter({ hasText: name }).click();
    await this.page.waitForURL('**/inventory-item.html?id=*');
  }
}
