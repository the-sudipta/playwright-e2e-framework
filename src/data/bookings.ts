import type { Booking } from '@support/types';

// Demo credentials published in the Restful Booker API documentation.
export const ADMIN_CREDENTIALS = { username: 'admin', password: 'password123' } as const;

function isoDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

// Fresh, fake booking for every call so parallel runs never share data.
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const start = 30 + Math.floor(Math.random() * 60);
  return {
    firstname: 'Ayesha',
    lastname: `Rahman-${Date.now() % 100000}`,
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: isoDate(start), checkout: isoDate(start + 3) },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
