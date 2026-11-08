import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { ProductPage } from '@pages/ProductPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutInfoPage } from '@pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '@pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';
import { SideMenu } from '@pages/components/SideMenu';
import type { KnownDefect } from '@data/known-defects';
import { USERS, type UserName } from '@data/users';

interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  sideMenu: SideMenu;
}

interface Session {
  /** Logs in through the UI and waits for the product list. */
  loginAs: (user: UserName) => Promise<InventoryPage>;
}

export const test = base.extend<Pages & Session>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInfoPage: async ({ page }, use) => use(new CheckoutInfoPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  sideMenu: async ({ page }, use) => use(new SideMenu(page)),
  loginAs: async ({ page, loginPage, inventoryPage }, use) => {
    await use(async (user = USERS.standard) => {
      await loginPage.open();
      await loginPage.login(user);
      await page.waitForURL('**/inventory.html');
      return inventoryPage;
    });
  },
});

/** Marks a test as an expected failure caused by a reported defect, with a link to the report. */
export function knownDefect(defect: KnownDefect): void {
  test.info().annotations.push({ type: 'issue', description: `${defect.id}: ${defect.url}` });
  test.fail(true, `${defect.id} - see ${defect.url}`);
}

export { expect };
