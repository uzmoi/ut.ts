/**
 * Create unique array by specified function, using SameValueZero comparison.
 *
 * @example
 * ```ts
 * const xs = [
 *   { id: 0, name: "foo" },
 *   { id: 1, name: "foo" },
 *   { id: 2, name: "bar" },
 * ];
 * uniqueBy(xs, x => x.name) // => [{ id: 0, name: "foo" }, { id: 2, name: "bar" }]
 * ```
 */
export const uniqueBy = <T>(
  xs: Iterable<T>,
  getUniquifier: (x: T) => unknown,
): T[] => {
  const seen = new Set();
  const result: T[] = [];

  for (const x of xs) {
    const uniquifier = getUniquifier(x);
    if (!seen.has(uniquifier)) {
      seen.add(uniquifier);
      result.push(x);
    }
  }

  return result;
};
