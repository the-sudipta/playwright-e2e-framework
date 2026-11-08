// Defects found and reported in the manual testing case study; UI tests that hit them are marked test.fail.
const REPORTS = 'https://github.com/the-sudipta/manual-testing-case-study/blob/main/bug-reports';

export const KNOWN_DEFECTS = {
  sameImageForAllProducts: {
    id: 'BUG-002',
    url: `${REPORTS}/BUG-002-problem-user-all-six-products-show-the-same-dog-image.md`,
  },
  sortingHasNoEffect: {
    id: 'BUG-003',
    url: `${REPORTS}/BUG-003-problem-user-sorting-the-product-list-has-no-effect.md`,
  },
  addToCartBroken: {
    id: 'BUG-004',
    url: `${REPORTS}/BUG-004-problem-user-add-to-cart-does-nothing-for-three-of-the-six-p.md`,
  },
  wrongProductPage: {
    id: 'BUG-006',
    url: `${REPORTS}/BUG-006-problem-user-clicking-a-product-opens-a-different-product-pag.md`,
  },
  lastNameOverwritesFirst: {
    id: 'BUG-007',
    url: `${REPORTS}/BUG-007-problem-user-typing-in-last-name-overwrites-first-name-checko.md`,
  },
  finishDoesNothing: {
    id: 'BUG-009',
    url: `${REPORTS}/BUG-009-error-user-finish-button-does-nothing-the-order-cannot-be-com.md`,
  },
  unroundedItemTotal: {
    id: 'BUG-001',
    url: `${REPORTS}/BUG-001-item-total-shows-an-unrounded-value-121-94999999999999-on-th.md`,
  },
} as const;

export type KnownDefect = (typeof KNOWN_DEFECTS)[keyof typeof KNOWN_DEFECTS];
