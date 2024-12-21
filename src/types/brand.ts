// 補完や`keyof Brand<T>`でキーが出てこないようにunionにする。
// エラーメッセージ内での型名が Brand になるように`declare namespace`を使用。

/** @internal */
declare namespace A {
  /** @internal */
  export interface Brand<Name extends string | symbol> {
    "__?-brand": { [_ in Name]: never };
  }
}

/** @internal */
declare namespace B {
  /** @internal */
  export interface Brand<Name extends string | symbol> {
    "__?+brand": { [_ in Name]: never };
  }
}

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
export type Brand<Name extends string | symbol> = A.Brand<Name> | B.Brand<Name>;

// 型追加するならファイル名phantomにしたほうがいいかも。
