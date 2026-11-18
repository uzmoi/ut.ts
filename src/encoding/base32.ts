import { createDecodeMap } from "./table.ts";

const BASE32_BIT_LENGTH = 5;
const BASE32_MASK = 0b11111;

export const BASE32_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export const BASE32HEX_SYMBOLS = "0123456789ABCDEFGHIJKLMNOPQRSTUV";

export const encodeBase32 = (
  u8array: Uint8Array,
  symbols: string,
  options?: { omitPadding?: boolean },
): string => {
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

  if (options?.omitPadding) return string;

  // padding 8
  return string.padEnd(((string.length + 7) >> 3) << 3, "=");
};

export const decodeBase32 = (
  string: string,
  symbols: string,
  options?: { noPadding?: boolean },
): Uint8Array => {
  const decodeMap = createDecodeMap(symbols, false);

  let length = string.length;

  if (!options?.noPadding) {
    if (length & 0b111) {
      throw new Error("Length must be multiple of 8");
    }

    // strip padding
    while (string[length - 1] === "=") length--;
  }

  const u8array = new Uint8Array(length * (BASE32_BIT_LENGTH / 8));

  let byteIndex = 0;

  let state = 0;
  let offset = 0;

  for (let i = 0; i < length; i++) {
    const u5 = decodeMap[string.charCodeAt(i)]!;
    if (!(u5 < 0xff)) {
      throw new SyntaxError(`Invalid symbol: "${string[i]}"`);
    }

    offset += BASE32_BIT_LENGTH;
    state = (state << BASE32_BIT_LENGTH) | u5;

    if (offset >= 8) {
      offset -= 8;
      u8array[byteIndex++] = state >> offset;
    }
  }

  return u8array;
};
