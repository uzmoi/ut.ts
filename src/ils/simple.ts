export const SameValueZero = (left: unknown, right: unknown) =>
  left === left ? left === right : right !== right;

export const clamp = (x: number, lower: number, upper: number): number =>
  +(lower > upper ? x : lower > x ? lower : x > upper ? upper : x);

/**
 * Performs modulo operations,
 * but unlike the `%` operator,
 * always returns a positive number.
 *
 * @example
 * modulo(-12, 10) === 8
 */
export const modulo = (x: number, mod: number): number => (
  (x %= mod) < 0
    ? mod < 0 ? x - mod : x + mod // x + abs(mod)
    : x + 0 // -0 + +0 === +0
);
