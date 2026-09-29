/**
 * Input sanitising for user-supplied text (custom T-shirt text, forms).
 *
 * React already escapes text content, so this is defence-in-depth: we strip
 * control characters and angle brackets, collapse whitespace and enforce a
 * length limit. NEVER render user text with dangerouslySetInnerHTML.
 */
export function sanitiseText(input: string, maxLength: number): string {
  return input
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength);
}

/** Loose, pragmatic validators used by forms (server must re-validate). */
export const validators = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  /** Indian mobile: optional +91/0 prefix, then 10 digits starting 6–9. */
  phone: (v: string) => /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
  pincode: (v: string) => /^[1-9]\d{5}$/.test(v.trim()),
};
