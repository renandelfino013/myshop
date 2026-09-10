import dotenv from "dotenv";
dotenv.config();
import {
  validatePasswordResetSchema,
  validateSchemapassword,
} from "schemas/reset-password./password-reset.schema";
import {
  createresetkey,
  updatepassword,
} from "services/auth/reset-password/reset-password-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseabstration from "utils/response/responseAbstration";
export async function handler(req) {
  if (req.method === "POST") {
    let { email } = req.body;
    const data = validatePasswordResetSchema({ email });
    await createresetkey(data.email);

    return responseabstration(200, "reset key created");
  } else if (req.method === "PATCH") {
    const { key, newpassword } = req.body;

    const data = validateSchemapassword({ newpassword, key });
    await updatepassword(data.key, data.newpassword);

    return responseabstration(200, "password updated successfully");
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
