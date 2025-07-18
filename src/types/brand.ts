declare const brand: unique symbol;

/**
 * Utility type for creating Branded Types.
 * Use intersection (`&`) with this type to add brands.
 *
 * `Brand<"A" | "B">` is equivalent to `Brand<"A"> & Brand<"B">`.
 *
 * @example
 * ```ts
 * type Id = string & Brand<"Id">;
 * const createId = (id: string) => id as Id;
 * ```
 */
export interface Brand<in Name extends string | symbol> {
  [brand]: { [_ in Name]: never };
}

// 型追加するならファイル名phantomにしたほうがいいかも。
