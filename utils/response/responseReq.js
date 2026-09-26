/**
 * @param {import("next").NextApiResponse} res
 * @param {number} statusCode
 * @param {boolean} success
 * @param {string} message
 * @param {any[]} data
 * @param {{
 *   action: "set" | "clear",
 *   value?: string
 * }} cookie
 */
import { createacookie } from "utils/helper/auth/cookie/createacookie";

export default async function responseReq(
  res,
  statusCode,
  success,
  message,
  data,
  cookie,
) {
  if (cookie && cookie.action === "set") {
    await createacookie(res, "token", cookie.value, {
      secure: true,
      path: "/api/v1",
      httpOnly: true,
      maxAge: 14400,
      sameSite: "strict",
    });
  }
  if (cookie && cookie.action === "clear") {
    await createacookie(res, "token", "", {
      secure: true,
      path: "/api/v1",
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
    });
  }
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
}
