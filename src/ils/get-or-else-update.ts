/**
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 *
 * const map = new Map();
 *
 * let count = 0;
 * const f = () => ++count;
 *
 * assertEquals(getOrElseUpdate(map, "one", f), 1);
 * assertEquals(map, new Map([["one", 1]]));
 *
 * assertEquals(getOrElseUpdate(map, "two", f), 2);
 * assertEquals(map, new Map([["one", 1], ["two", 2]]));
 *
 * assertEquals(getOrElseUpdate(map, "two", f), 2);
 * assertEquals(map, new Map([["one", 1], ["two", 2]]));
 * ```
 */
export const getOrElseUpdate = <K, V>(
  map: Map<K, V>,
  key: K,
  f: () => V,
): V => {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const value = f();

  map.set(key, value);

  return value;
};
