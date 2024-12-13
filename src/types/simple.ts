export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonValue }
  | JsonValue[];

// deno-lint-ignore no-explicit-any
export type Callable = (...args: any) => unknown;

export type UnionToIntersection<T> = [T] extends [never] ? never
  : (T extends unknown ? (x: T) => void : never) extends ((x: infer U) => void)
    ? U
  : never;

export type NormalizeObject<T> = T extends object ? { [P in keyof T]: T[P] }
  : T;
