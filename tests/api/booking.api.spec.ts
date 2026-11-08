import { test, expect } from '@fixtures/api';
import { newBooking } from '@data/bookings';
import type { Booking } from '@support/types';

test.describe('API - Booking', () => {
  test(
    'should create a booking and read it back',
    { tag: ['@smoke', '@api'] },
    async ({ bookings, createdBooking }) => {
      const response = await bookings.get(createdBooking.bookingid);
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual(createdBooking.booking);
    },
  );

  test('should find the booking by first and last name', { tag: ['@api'] }, async ({ bookings, createdBooking }) => {
    const { firstname, lastname } = createdBooking.booking;
    const ids = ((await (await bookings.list({ firstname, lastname })).json()) as { bookingid: number }[]).map(
      (b) => b.bookingid,
    );
    expect(ids).toContain(createdBooking.bookingid);
  });

  test('should replace a booking with PUT', { tag: ['@api'] }, async ({ authorizedBookings, createdBooking }) => {
    const replacement: Booking = newBooking({
      firstname: 'Farhana',
      totalprice: 480,
      additionalneeds: 'Airport pickup',
    });
    const response = await authorizedBookings.update(createdBooking.bookingid, replacement);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(replacement);
  });

  test(
    'should change only the sent fields with PATCH',
    { tag: ['@api'] },
    async ({ authorizedBookings, createdBooking }) => {
      const response = await authorizedBookings.partialUpdate(createdBooking.bookingid, { totalprice: 333 });
      expect(await response.json()).toEqual({ ...createdBooking.booking, totalprice: 333 });
    },
  );

  test('should delete a booking and then return 404', { tag: ['@api'] }, async ({ bookings, authorizedBookings }) => {
    const created = await (await bookings.create(newBooking())).json();
    expect((await authorizedBookings.delete(created.bookingid)).status()).toBe(201);
    expect((await bookings.get(created.bookingid)).status()).toBe(404);
  });

  test(
    'should refuse an update without a token',
    { tag: ['@negative', '@api'] },
    async ({ bookings, createdBooking }) => {
      const response = await bookings.update(createdBooking.bookingid, newBooking());
      expect(response.status()).toBe(403);
    },
  );

  test('should return 404 for an unknown booking', { tag: ['@negative', '@api'] }, async ({ bookings }) => {
    expect((await bookings.get(999_999_999)).status()).toBe(404);
  });
});
