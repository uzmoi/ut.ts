type UncurryThis = <T, A extends unknown[], R>(
  f: (this: T, ...args: A) => R,
) => (thisArg: T, ...args: A) => R;

export const uncurryThis: UncurryThis = Function.bind.bind<UncurryThis>(
  Function.call,
);
