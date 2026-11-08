import type { Customer, Product } from '@support/types';

export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', slug: 'sauce-labs-backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', slug: 'sauce-labs-bike-light', price: 9.99 },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', slug: 'sauce-labs-bolt-t-shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', slug: 'sauce-labs-fleece-jacket', price: 49.99 },
  onesie: { name: 'Sauce Labs Onesie', slug: 'sauce-labs-onesie', price: 7.99 },
  redTShirt: { name: 'Test.allTheThings() T-Shirt (Red)', slug: 'test.allthethings()-t-shirt-(red)', price: 15.99 },
} satisfies Record<string, Product>;

export const ALL_PRODUCTS: Product[] = Object.values(PRODUCTS);

export const TAX_RATE = 0.08;

// Fake customer data.
export const CUSTOMER: Customer = { firstName: 'Rahim', lastName: 'Uddin', postalCode: '1207' };

export const MISSING_FIELD_CASES: { field: keyof Customer; error: string }[] = [
  { field: 'firstName', error: 'Error: First Name is required' },
  { field: 'lastName', error: 'Error: Last Name is required' },
  { field: 'postalCode', error: 'Error: Postal Code is required' },
];
