import { createDecodeMap } from "./table.ts";

const BASE64_BIT_LENGTH = 6;
const BASE64_MASK = 0b111111;

export const BASE64_SYMBOLS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const encodeBase64 = (u8array: Uint8Array): string => {
  let string = "";

  let state = 0;
  let offset = 0;

  for (let i = 0; i < u8array.length; i++) {
    state = (state << 8) | u8array[i]!;
    offset += 8 - BASE64_BIT_LENGTH;
    string += BASE64_SYMBOLS[(state >> offset) & BASE64_MASK]!;

    if (offset > BASE64_BIT_LENGTH) {
      offset -= BASE64_BIT_LENGTH;
      string += BASE64_SYMBOLS[(state >> offset) & BASE64_MASK]!;
    }
  }

  if (offset > 0) {
    string +=
      BASE64_SYMBOLS[(state << (BASE64_BIT_LENGTH - offset)) & BASE64_MASK]!;
  }

  // padding
  const r = string.length & 0b11;
  return r === 2 ? `${string}==` : r === 3 ? `${string}=` : string;
};

const decodeSymbolMap = /* #__PURE__ */ createDecodeMap(BASE64_SYMBOLS, true);

export const decodeBase64 = (string: string): Uint8Array => {
  let length = string.length;

  if (length & 0b11) {
    throw new Error("Length must be multiple of 4");
  }

  // strip padding
  if (string[length - 1] === "=") {
    length--;
    if (string[length - 1] === "=") length--;
  }

  const u8array = new Uint8Array(length * (BASE64_BIT_LENGTH / 8));

  let byteIndex = 0;

  let state = 0;
  let offset = 0;

  for (let i = 0; i < length; i++) {
    const u6 = decodeSymbolMap[string.charCodeAt(i)]!;
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
