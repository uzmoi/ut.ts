const cache: Record<string, Uint8Array> = {};

export const createDecodeMap = (
  symbols: string,
  caseSensitive: boolean,
): Uint8Array => {
  if (cache[symbols]) return cache[symbols]!;

  const decodeSymbolMap = new Uint8Array(0x80).fill(0xff);
  cache[symbols] = decodeSymbolMap;

  for (let i = 0; i < symbols.length; i++) {
    const code = symbols.charCodeAt(i);
    decodeSymbolMap[code] = i;

    // biome-ignore format: is upper alphabet
    if (!caseSensitive && 0x40 < code && code < 0x5b) {
      // to lower alphabet
      decodeSymbolMap[code + 0x20] = i;
    }
  }

  return decodeSymbolMap;
};
