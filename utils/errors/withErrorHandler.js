import handleError from "utils/errors/globalErrorHandler";
import responseReq from "utils/response/responseReq";
import { requestContext } from "infra/request-context/request-context";
export function withErrorHandler(handler) {
  return async (req, res) => {
    const storageProvider = req.headers["x-test-provider"] ?? "cloudinary";

    try {
      return await requestContext.run({ storageProvider }, async () => {
        const response = await handler(req, res);

        return await responseReq(
          res,
          response.statusCode,
          response.success,
          response.message,
          response.data,
        );
      });
    } catch (error) {
      handleError(error, res);
    }
  };
}
