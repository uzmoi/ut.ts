export const createDecodeMap = (encodeSymbols: string) => {
  const decodeSymbolMap = new Uint8Array(0x80).fill(0xff);

  for (let i = 0; i < encodeSymbols.length; i++) {
    const code = encodeSymbols.charCodeAt(i);
    decodeSymbolMap[code] = i;
    // biome-ignore format: is upper alphabet
    if (0x40 < code && code < 0x50) {
      // to lower alphabet
      decodeSymbolMap[code + 0x20] = i;
    }
  }

  return decodeSymbolMap;
};
