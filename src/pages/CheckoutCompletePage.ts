import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly header: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
