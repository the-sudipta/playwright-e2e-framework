import { test as base, expect } from '@playwright/test';
import { AuthClient } from '@api/AuthClient';
import { BookingClient } from '@api/BookingClient';
import { ADMIN_CREDENTIALS, newBooking } from '@data/bookings';
import type { CreatedBooking } from '@support/types';

interface ApiFixtures {
  authClient: AuthClient;
  /** Booking client without a token (for read and negative checks). */
  bookings: BookingClient;
  /** Booking client with a valid token. */
  authorizedBookings: BookingClient;
  /** A booking created before the test and deleted after it. */
  createdBooking: CreatedBooking;
}

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => use(new AuthClient(request)),
  bookings: async ({ request }, use) => use(new BookingClient(request)),
  authorizedBookings: async ({ request, authClient }, use) => {
    const token = await authClient.token(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
    await use(new BookingClient(request, token));
  },
  createdBooking: async ({ bookings, authorizedBookings }, use) => {
    const response = await bookings.create(newBooking());
    expect(response.ok()).toBeTruthy();
    const created = (await response.json()) as CreatedBooking;
    await use(created);
    await authorizedBookings.delete(created.bookingid);
  },
});

export { expect };
