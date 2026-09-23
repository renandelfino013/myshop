import { createacookie } from "utils/helper/auth/cookie/createacookie";

export default async function responseReq(
  res,
  statusCode,
  success,
  message,
  data,
) {
  if (data && data[0].token) {
    await createacookie(res, "token", data[0].token, {
      secure: true,
      path: "/api/v1",
      httpOnly: true,
      maxAge: 14400,
      sameSite: "strict",
    });
    data.pop();
  }
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
}
