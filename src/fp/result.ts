interface ResultOk<out A> extends ResultBase {
  readonly ok: true;
  readonly value: A;
}

interface ResultErr<out E> extends ResultBase {
  readonly ok: false;
  readonly value: E;
}

export type Result<A, E> = ResultOk<A> | ResultErr<E>;

/**
 * @deprecated
 * Use {@link Result} type instead.
 *
 * This type is exported for jsr.io to generate documentation of this type
 * (see https://github.com/jsr-io/jsr/issues/694).
 *
 * @internal
 */
export class ResultBase {
  /** @ignore */
  declare static [Symbol.hasInstance]: (
    x: unknown,
  ) => x is Result<unknown, unknown>;

  static try<A>(runner: () => A): Result<A, unknown> {
    try {
      return Ok(runner());
    } catch (error) {
      return Err(error);
    }
  }

  constructor(
    readonly ok: boolean,
    readonly value: unknown,
  ) {}

  toString(): string {
    const value = String(this.value);
    return this.ok ? `Ok(${value})` : `Err(${value})`;
  }

  /**
   * @deprecated Use `.value` instead of calling `.unwrap()` on `Ok`.
   * @ignore
   */
  unwrap<A>(this: Result<A, never>): A;
  /**
   * @deprecated Calling `.unwrap()` on `Err` always throws a TypeError.
   * @ignore
   */
  unwrap(this: Result<never, unknown>): never;
  /**
   * Returns the `Ok` value or throw an error if `Err`.
   *
   * @throws TypeError if `Err`.
   * @example
   * ```ts
   * import { assertEquals, assertThrows } from "@std/assert";
   *
   * assertEquals(Ok(1).unwrap(), 1);
   * assertThrows(() => Err("error").unwrap());
   * ```
   */
  unwrap<A>(this: Result<A, unknown>): A;
  unwrap<A>(this: Result<A, unknown>): A {
    if (this.ok) return this.value;
    throw new TypeError("Called unwrap on `Err`", { cause: this.value });
  }

  /**
   * @deprecated Use `.value` instead of calling `.unwrapOr()` on `Ok`.
   * @ignore
   */
  unwrapOr<A>(this: Result<A, never>, value: unknown): A;
  /**
   * @deprecated Calling `.unwrapOr()` on `Err` always returns the argument.
   * @ignore
   */
  unwrapOr<B>(this: Result<never, unknown>, value: B): B;
  /**
   * Returns the `Ok` value or provided value if `Err`.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * assertEquals(Ok(1).unwrapOr(null), 1);
   * assertEquals(Err("error").unwrapOr(null), null);
   * ```
   */
  unwrapOr<A>(this: Result<A, unknown>, value: NoInfer<A>): A;
  /**
   * Returns the `Ok` value or provided value if `Err`.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * assertEquals(Ok(1).unwrapOr(null), 1);
   * assertEquals(Err("error").unwrapOr(null), null);
   * ```
   */
  unwrapOr<A, const B>(this: Result<A, unknown>, value: B): A | B;
  unwrapOr<A, B>(this: Result<A, unknown>, value: B): A | B {
    return this.ok ? this.value : value;
  }

  /**
   * Map `Result<A, E>` to `Result<B, E>` by applying a function to the `Ok` value.
   * Leave the `Err` unchanged.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * assertEquals(Ok(12).map(x => x * 2), Ok(24));
   * assertEquals(Err("error").map(x => x * 2), Err("error"));
   * ```
   */
  map<E, B>(this: Result<never, E>, fn: (value: never) => B): Result<B, E>;
  map<A, E, const B>(this: Result<A, E>, fn: (value: A) => B): Result<B, E>;
  map<E, B>(this: Result<never, E>, fn: (value: never) => B): Result<B, E> {
    return this.ok ? Ok(fn(this.value)) : this;
  }

  /**
   * Returns the `Ok` value with a function applied, or provided value if `Err`.
   *
   * This is equivalent to `.map(fn).unwrapOr(value)`.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * assertEquals(Ok(12).mapOr(0, x => x * 2), 24);
   * assertEquals(Err("error").mapOr(0, x => x * 2), 0);
   * ```
   */
  mapOr<B>(this: Result<never, unknown>, value: B, fn: (value: never) => B): B;
  mapOr<A, const B>(this: Result<A, unknown>, value: B, fn: (value: A) => B): B;
  mapOr<A, const B, const C>(
    this: Result<A, unknown>,
    value: B,
    fn: (value: A) => C,
  ): B | C;
  mapOr<B>(this: Result<never, unknown>, value: B, fn: (value: never) => B): B {
    return this.ok ? fn(this.value) : value;
  }

  /**
   * Returns the result of applying a function to the `Ok` value, or `Err` value.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * const reciprocal = (x: number) =>
   *   Number.isFinite(x) && x !== 0
   *     ? Ok(1 / x)
   *     : Err(`Cannot calculate reciprocal of ${x}.`);
   *
   * assertEquals(Ok(71).flatMap(reciprocal), Ok(1 / 71));
   * assertEquals(Ok(0).flatMap(reciprocal), Err("Cannot calculate reciprocal of 0."));
   * assertEquals(Err("error").flatMap(reciprocal), Err("error"));
   * ```
   */
  flatMap<A, E, B, F = E>(
    this: Result<A, E>,
    fn: (value: A) => Result<B, F>,
  ): Result<B, E | F> {
    return this.ok ? fn(this.value) : this;
  }

  /**
   * Map `Result<A, E>` to `Result<A, F>` by applying a function to the `Err` value.
   * Leave the `Ok` unchanged.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * assertEquals(Ok(12).mapErr(x => x + "!"), Ok(12));
   * assertEquals(Err("error").mapErr(x => x + "!"), Err("error!"));
   * ```
   */
  mapErr<A, E, const F>(this: Result<A, E>, fn: (value: E) => F): Result<A, F> {
    return this.ok ? this : Err(fn(this.value));
  }

  /**
   * Returns the result of applying a function to the `Err` value, or `Ok` value.
   *
   * @example
   * ```ts
   * import { assertEquals } from "@std/assert";
   *
   * const f = (x: string) => {
   *   const n = parseInt(x, 10);
   *   return Number.isNaN(n) ? Err(x) : Ok(n);
   * };
   *
   * assertEquals(Ok(71).orElse(f), Ok(71));
   * assertEquals(Err("127").orElse(f), Ok(127));
   * assertEquals(Err("foo").orElse(f), Err("foo"));
   * ```
   */
  orElse<A, B, E, F = E>(
    this: Result<A, E>,
    fn: (error: E) => Result<B, F>,
  ): Result<A | B, F> {
    return this.ok ? this : fn(this.value);
  }
}

/**
 * @internal
 */
export interface ResultClass {
  /**
   * @deprecated
   * The entity of this value is a class, and this method does not actually exist.
   * This method is declared so that `instanceof` can be used in typescript.
   *
   * @ignore
   */
  [Symbol.hasInstance](x: unknown): x is Result<unknown, unknown>;

  try<const A>(f: () => A): Result<A, unknown>;
}

/**
 * @see {@link ResultBase}
 */
export const Result: ResultClass = ResultBase;

/**
 * Create `Ok` from a value.
 */
export const Ok = <const A>(value: A): ResultOk<A> =>
  new ResultBase(true, value) as ResultOk<A>;

/**
 * Create `Err` from an error.
 */
export const Err = <const E>(error: E): ResultErr<E> =>
  new ResultBase(false, error) as ResultErr<E>;
