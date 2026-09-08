import handleError from "utils/errors/globalErrorHandler";
import responseReq from "utils/response/responseReq";
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      const response = await handler(req, res);
      await responseReq(
        res,
        response.statusCode,
        response.success,
        response.message,
        response.data,
      );
    } catch (error) {
      handleError(error, res);
    }
  };
}
