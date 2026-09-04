import handleError from "utils/errors/globalErrorHandler";

export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleError(error, res);
    }
  };
}
