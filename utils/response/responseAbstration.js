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

export default function responseAbstration(statusCode, message, data, cookie) {
  return {
    statusCode: statusCode,
    success: statusCode < 400,
    message: message,
    data: data,
    cookie,
  };
}
