export const SameValueZero = (left: unknown, right: unknown) =>
  left === left ? left === right : right !== right;

export const clamp = (x: number, lower: number, upper: number): number =>
  +(lower > upper ? x : lower > x ? lower : x > upper ? upper : x);
