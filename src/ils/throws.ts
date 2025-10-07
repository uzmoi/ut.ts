/**
 * Implement later.
 *
 * @throws {Error} always
 * @see https://doc.rust-lang.org/std/macro.todo.html
 */
export const todo: (message?: string) => never = (message) => {
  throw new Error("not implemented" + (message ? `: ${message}` : ""));
};

/**
 * Unreachable code path.
 *
 * @throws {Error} always
 * @see https://doc.rust-lang.org/std/macro.unreachable.html
 */
export const unreachable: <_ extends never>(message?: string) => never = (
  message,
) => {
  throw new Error("unreachable" + (message ? `: ${message}` : ""));
};
