// Shared types used by page objects, API clients, fixtures and test data.

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  name: string;
  slug: string;
  price: number;
}

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreatedBooking {
  bookingid: number;
  booking: Booking;
}
