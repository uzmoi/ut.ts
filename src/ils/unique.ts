/**
 * Create unique array by specified function, using SameValueZero comparison.
 *
 * @see {@link uniqueLastBy}
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

/**
 * @see {@link uniqueBy}
 * @example
 * ```ts
 * const xs = [
 *   { id: 0, name: "foo" },
 *   { id: 1, name: "foo" },
 *   { id: 2, name: "bar" },
 * ];
 * uniqueLastBy(xs, x => x.name).toArray() // => [{ id: 1, name: "foo" }, { id: 2, name: "bar" }]
 * ```
 */
export const uniqueLastBy = <T>(
  xs: Iterable<T>,
  getUniquifier: (x: T) => unknown,
): IteratorObject<T> => {
  const seen = new Map<unknown, T>();

  for (const x of xs) {
    seen.set(getUniquifier(x), x);
  }

  return seen.values();
};
