import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

// Checkout step two: order overview with totals.
export class CheckoutOverviewPage extends BasePage {
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemTotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  // Step one also has a "cancel" button (it goes to the cart), so act only once the overview is shown.
  private async ready(): Promise<void> {
    await this.page.waitForURL('**/checkout-step-two.html');
    await this.finishButton.waitFor();
  }

  async amount(label: Locator): Promise<number> {
    await this.ready();
    const text = await label.innerText();
    return Number(text.split('$')[1]);
  }

  async finish(): Promise<void> {
    await this.ready();
    // Own timeout: when Finish hangs (error_user on WebKit) the step fails clearly instead of the whole test timing out.
    await this.finishButton.click({ timeout: 10_000 });
  }

  async cancel(): Promise<void> {
    await this.ready();
    await this.cancelButton.click();
  }
}
