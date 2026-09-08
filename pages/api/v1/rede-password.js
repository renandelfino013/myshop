import dotenv from "dotenv";
dotenv.config();
import { createresetkey } from "models/users/resetpassword";
import {
  validatePasswordResetSchema,
  validateSchemapassword,
} from "schemas/reset-password./password-reset.schema";
import { updatepassword } from "services/auth/authservices";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseabstration from "utils/response/responseAbstration";
export async function handler(req) {
  if (req.method === "POST") {
    let { email } = req.body;
    const data = validatePasswordResetSchema({ email });
    let resetkey = await createresetkey(data.email);
    if (resetkey) {
      return responseabstration(200, "reset key created", { resetkey });
    }
  } else if (req.method === "PATCH") {
    const { key, newpassword } = req.body;

    const data = validateSchemapassword({ newpassword });
    let ok = await updatepassword(key, data.newpassword);
    if (ok) {
      return responseabstration(200, "password updated successfully");
    }
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
