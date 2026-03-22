export const SameValueZero = (left: unknown, right: unknown) =>
  left === left ? left === right : right !== right;
