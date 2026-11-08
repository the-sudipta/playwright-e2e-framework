import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly name: Locator;
  readonly price: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    // The list and the detail page share data-test names, so scope to the details container.
    const details = page.locator('.inventory_details_container');
    this.name = details.getByTestId('inventory-item-name');
    this.price = details.getByTestId('inventory-item-price');
    this.backButton = page.getByTestId('back-to-products');
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
