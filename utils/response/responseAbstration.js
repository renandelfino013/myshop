export default function resposeAbstration(statusCode, message, data) {
  return {
    statusCode: statusCode,
    success: statusCode < 400,
    message: message,
    data: data,
  };
}
