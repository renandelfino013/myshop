export default function responseReq(res, statusCode, success, message, data) {
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data,
  });
}
