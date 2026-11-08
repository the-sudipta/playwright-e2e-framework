import type { Locator, Page } from '@playwright/test';
import type { Customer } from '@support/types';
import { BasePage } from './BasePage';

// Checkout step one: customer information.
export class CheckoutInfoPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
  }

  async ready(): Promise<void> {
    await this.page.waitForURL('**/checkout-step-one.html');
    await this.continueButton.waitFor();
  }

  // WebKit can drop a value typed while the form is still rendering; fill once more if it did.
  // No error is raised: if the field still refuses the value, the test sees what a user would see.
  private async fillField(field: Locator, value: string): Promise<void> {
    await field.fill(value);
    if ((await field.inputValue()) !== value) await field.fill(value);
  }

  async fill(customer: Partial<Customer>): Promise<void> {
    await this.ready();
    if (customer.firstName) await this.fillField(this.firstName, customer.firstName);
    if (customer.lastName) await this.fillField(this.lastName, customer.lastName);
    if (customer.postalCode) await this.fillField(this.postalCode, customer.postalCode);
  }

  // Types key by key, the way a real user does (some defects only show up this way).
  async type(customer: Customer): Promise<void> {
    await this.ready();
    await this.firstName.pressSequentially(customer.firstName);
    await this.lastName.pressSequentially(customer.lastName);
    await this.postalCode.pressSequentially(customer.postalCode);
  }

  async submit(customer: Partial<Customer>): Promise<void> {
    await this.fill(customer);
    await this.continueButton.click();
  }
}
