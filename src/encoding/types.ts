// deno-fmt-ignore
type LengthOf<
  T extends string,
  U extends 0[] = [],
> =
  T extends `${infer C}${infer Rest}` ?
    string extends C ? number : LengthOf<Rest, [...U, 0]>
  : string extends T ? number : U["length"];

export type Length32<T extends string> =
  & T
  & (LengthOf<T> extends 32 ? string : { length: 32 });

export type Length64<T extends string> =
  & T
  & (LengthOf<T> extends 64 ? string : { length: 64 });
