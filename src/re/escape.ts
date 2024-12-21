const REGEX_CHAR_RE = /[$^()?*+{}\-.[\]\\|]/g;

/**
 * escapes regex characters.
 *
 * @example
 * ```ts
 * escapeRegex("(foo|bar)+") === String.raw`\(foo\|bar\)\+`
 * ```
 */
export const escapeRegex = (reString: string): string =>
  reString.replace(REGEX_CHAR_RE, "\\$&");
