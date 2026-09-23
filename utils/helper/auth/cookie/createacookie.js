import { stringifySetCookie } from "cookie";

export async function createacookie(res, name, value, options) {
  const serializedCookie = stringifySetCookie({ name, value, ...options });
  res.setHeader("Set-Cookie", serializedCookie);
}
