import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseAbstration from "utils/response/responseAbstration";
export async function handler(req) {
  if (req.method === "POST") {
    return responseAbstration(200, "user logged out", [], { action: "clear" });
  } else {
    throw new methodNotAllowedError([
      {
        field: "method",
        message: "Method not allowed",
      },
    ]);
  }
}
export default withErrorHandler(handler);
