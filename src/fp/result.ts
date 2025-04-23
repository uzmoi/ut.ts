interface ResultOk<out A, out E> extends ResultBase<A, E> {
  readonly ok: true;
  readonly value: A;
}

interface ResultErr<out A, out E> extends ResultBase<A, E> {
  readonly ok: false;
  readonly value: E;
}

export type Result<A, E> = ResultOk<A, E> | ResultErr<A, E>;

class ResultBase<out A, out E> {
  static try<A>(runner: () => A): Result<A, unknown> {
    try {
      return Ok(runner());
    } catch (error) {
      return Err(error);
    }
  }

  private constructor(
    readonly ok: boolean,
    readonly value: A | E,
  ) {}

  toString(): string {
    const value = String(this.value);
    return this.ok ? `Ok(${value})` : `Err(${value})`;
  }

  /**
   * @deprecated Use `.value` instead of calling `.unwrap()` on `Ok`.
   * @ignore
   */
  unwrap(this: ResultOk<A, E>): A;
  /**
   * @deprecated Calling `.unwrap()` on `Err` always throws a TypeError.
   * @ignore
   */
  unwrap(this: ResultErr<A, E>): never;
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
  unwrap(): A;
  unwrap(this: Result<A, E>): A {
    if (this.ok) return this.value;
    throw new TypeError("Called unwrap on `Err`", { cause: this.value });
  }

  /**
   * @deprecated Use `.value` instead of calling `.unwrapOr()` on `Ok`.
   * @ignore
   */
  unwrapOr(this: ResultOk<A, E>, value: unknown): A;
  /**
   * @deprecated Calling `.unwrapOr()` on `Err` always returns the argument.
   * @ignore
   */
  unwrapOr<B>(this: ResultErr<A, E>, value: B): B;
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
  unwrapOr(value: A): A;
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
  unwrapOr<B>(value: B): A | B;
  unwrapOr<B>(this: Result<A, E>, value: B): A | B {
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
  map<B>(fn: (value: A) => B): Result<B, E>;
  map<B>(this: Result<A, E>, fn: (value: A) => B): Result<B, E> {
    return this.ok ? Ok(fn(this.value)) : (this as Result<never, E>);
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
  mapOr<B>(value: B, fn: (value: A) => B): B;
  mapOr<B, C>(value: B, fn: (value: A) => C): B | C;
  mapOr<B, C>(this: Result<A, E>, value: B, fn: (value: A) => C): B | C {
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
  flatMap<B, F = E>(fn: (value: A) => Result<B, F>): Result<B, E | F>;
  flatMap<B, F>(
    this: Result<A, E>,
    fn: (value: A) => Result<B, F>,
  ): Result<B, E | F> {
    return this.ok ? fn(this.value) : (this as Result<never, E>);
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
  mapErr<F>(fn: (value: E) => F): Result<A, F>;
  mapErr<F>(this: Result<A, E>, fn: (value: E) => F): Result<A, F> {
    return this.ok ? (this as Result<A, never>) : Err(fn(this.value));
  }
}

/**
 * @see {@link ResultBase}
 */
export const Result = ResultBase;

/**
 * Create `Ok` from a value.
 */
export const Ok = <A>(value: A): ResultOk<A, never> =>
  // @ts-expect-error: ignore
  new ResultBase(true, value) as Result<A, never>;

/**
 * Create `Err` from an error.
 */
export const Err = <E>(error: E): ResultErr<never, E> =>
  // @ts-expect-error: ignore
  new ResultBase(false, error) as Result<never, E>;
