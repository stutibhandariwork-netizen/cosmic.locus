/** Prefix for files in /public (images, data). Links via next/link get it automatically; these don't. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE}${path}`;
