export const isIterable = (value: unknown): value is Iterable<unknown> => (
  value != null &&
  typeof (value as Iterable<unknown>)[Symbol.iterator] === "function"
);

export const isAsyncIterable = (
  value: unknown,
): value is AsyncIterable<unknown> => (
  value != null &&
  typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function"
);
