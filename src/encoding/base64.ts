import { createDecodeMap } from "./table.ts";

const BASE64_BIT_LENGTH = 6;
const BASE64_MASK = 0b111111;

export const BASE64_SYMBOLS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const BASE64URL_SYMBOLS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

export const SORTABLE_BASE64_SYMBOLS =
  "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

export const encodeBase64 = (
  u8array: Uint8Array,
  symbols: string,
  options?: { omitPadding?: boolean },
): string => {
  let string = "";

  let state = 0;
  let offset = 0;

  for (let i = 0; i < u8array.length; i++) {
    state = (state << 8) | u8array[i]!;
    offset += 8 - BASE64_BIT_LENGTH;
    string += symbols[(state >> offset) & BASE64_MASK]!;

    if (offset > BASE64_BIT_LENGTH) {
      offset -= BASE64_BIT_LENGTH;
      string += symbols[(state >> offset) & BASE64_MASK]!;
    }
  }

  if (offset > 0) {
    string += symbols[(state << (BASE64_BIT_LENGTH - offset)) & BASE64_MASK]!;
  }

  if (options?.omitPadding) return string;

  // padding
  const r = string.length & 0b11;
  return r === 2 ? `${string}==` : r === 3 ? `${string}=` : string;
};

export const decodeBase64 = (
  string: string,
  symbols: string,
  options?: { noPadding?: boolean },
): Uint8Array => {
  const decodeMap = createDecodeMap(symbols, true);

  let length = string.length;

  if (!options?.noPadding) {
    if (length & 0b11) {
      throw new Error("Length must be multiple of 4");
    }

    // strip padding
    if (string[length - 1] === "=") {
      length--;
      if (string[length - 1] === "=") length--;
    }
  }

  const u8array = new Uint8Array(length * (BASE64_BIT_LENGTH / 8));

  let byteIndex = 0;

  let state = 0;
  let offset = 0;

  for (let i = 0; i < length; i++) {
    const u6 = decodeMap[string.charCodeAt(i)]!;
    if (!(u6 < 0xff)) {
      throw new SyntaxError(`Invalid symbol: "${string[i]}"`);
    }

    offset += BASE64_BIT_LENGTH;
    state = (state << BASE64_BIT_LENGTH) | u6;

    if (offset >= 8) {
      offset -= 8;
      u8array[byteIndex++] = state >> offset;
    }
  }

  return u8array;
};
