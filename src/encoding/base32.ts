import { createDecodeMap } from "./table.ts";

const BASE32_BIT_LENGTH = 5;

// deno-fmt-ignore
const base32EncodeSymbols = [
  "A", "B", "C", "D", "E", "F", "G", "H",
  "I", "J", "K", "L", "M", "N", "O", "P",
  "Q", "R", "S", "T", "U", "V", "W", "X",
  "Y", "Z", "2", "3", "4", "5", "6", "7",
] as const;

// deno-fmt-ignore
const base32hexEncodeSymbols = [
  "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9", "A", "B", "C", "D", "E", "F",
  "G", "H", "I", "J", "K", "L", "M", "N",
  "O", "P", "Q", "R", "S", "T", "U", "V",
] as const;

const BASE32_MASK = 0b11111;

const encode32 = (u8array: Uint8Array, symbols: readonly string[]): string => {
  let string = "";

  let state = 0;
  let offset = 0;

  for (let i = 0; i < u8array.length; i++) {
    state = (state << 8) | u8array[i]!;
    offset += 8 - BASE32_BIT_LENGTH;
    string += symbols[(state >> offset) & BASE32_MASK];

    if (offset > BASE32_BIT_LENGTH) {
      offset -= BASE32_BIT_LENGTH;
      string += symbols[(state >> offset) & BASE32_MASK];
    }
  }

  if (offset > 0) {
    string += symbols[(state << (BASE32_BIT_LENGTH - offset)) & BASE32_MASK];
  }

  // padding 8
  return string.padEnd(((string.length + 7) >> 3) << 3, "=");
};

export const encodeBase32 = (u8array: Uint8Array): string => {
  return encode32(u8array, base32EncodeSymbols);
};

export const encodeBase32Hex = (u8array: Uint8Array): string => {
  return encode32(u8array, base32hexEncodeSymbols);
};

const base32DecodeSymbolMap = /* #__PURE__ */ createDecodeMap(
  base32EncodeSymbols,
);

const base32hexDecodeSymbolMap = /* #__PURE__ */ createDecodeMap(
  base32hexEncodeSymbols,
);

const decode32 = (
  string: string,
  symbols: Uint8Array,
  name: string,
): Uint8Array => {
  let length = string.length;

  if (length & 0b111) {
    throw new Error("Length must be multiple of 8");
  }

  // strip padding
  while (string[length - 1] === "=") length--;

  const u8array = new Uint8Array(length * (BASE32_BIT_LENGTH / 8));

  let byteIndex = 0;

  let state = 0;
  let offset = 0;

  for (let i = 0; i < length; i++) {
    const x = symbols[string.charCodeAt(i)]!;
    if (!(x < 0xff)) {
      throw new RangeError(`Invalid ${name} symbol: "${string[i]}"`);
    }

    offset += BASE32_BIT_LENGTH;
    state = (state << BASE32_BIT_LENGTH) | x;

    if (offset >= 8) {
      offset -= 8;
      u8array[byteIndex++] = state >> offset;
    }
  }

  return u8array;
};

export const decodeBase32 = (string: string): Uint8Array => {
  return decode32(string, base32DecodeSymbolMap, "base32");
};

export const decodeBase32Hex = (string: string): Uint8Array => {
  return decode32(string, base32hexDecodeSymbolMap, "base32hex");
};
