import {
  getUserbyidUser,
  softRemoveMyUser,
} from "services/auth/users/users-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseAbstration from "utils/response/responseAbstration";
import validationtoken from "utils/validators/validationtoken";

export async function handler(req) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const session_version = req.headers["x-user-session_version"];
  await validationtoken(email, session_version);
  if (req.method === "GET") {
    const myuser = await getUserbyidUser(userId);
    return responseAbstration(200, "user found", myuser);
  } else if (req.method === "DELETE") {
    await softRemoveMyUser(userId);
    return responseAbstration(200, "user removed", [], { action: "clear" });
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
