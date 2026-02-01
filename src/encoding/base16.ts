import { createDecodeMap } from "./table.ts";

// deno-fmt-ignore
const base16EncodeSymbols = /* #__PURE__ */ Object.freeze([
  "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9", "A", "B", "C", "D", "E", "F",
]);

export const encodeBase16 = (u8array: Uint8Array): string => {
  let string = "";

  for (let i = 0; i < u8array.length; i++) {
    const u8 = u8array[i]!;
    string += base16EncodeSymbols[u8 >> 4]! + base16EncodeSymbols[u8 & 0b1111]!;
  }

  return string;
};

const decodeSymbolMap = /* #__PURE__ */ createDecodeMap(
  base16EncodeSymbols,
);

export const decodeBase16 = (string: string): Uint8Array => {
  const u8array = new Uint8Array(string.length / 2);

  let state = 0;

  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    const u4 = decodeSymbolMap[code];
    if (u4 === undefined || u4 === 0xff) {
      throw new RangeError(`Invalid base16 symbol: "${string[i]}"`);
    }

    if (i & 1) {
      u8array[i >> 1] = (state << 4) | u4;
    } else {
      state = u4;
    }
  }

  return u8array;
};
