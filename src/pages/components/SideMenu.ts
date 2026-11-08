import type { Locator, Page } from '@playwright/test';

// Burger menu available on every page after login.
export class SideMenu {
  readonly openButton: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetLink = page.getByTestId('reset-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
  }

  async logout(): Promise<void> {
    await this.openButton.click();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openButton.click();
    await this.resetLink.click();
  }
}
