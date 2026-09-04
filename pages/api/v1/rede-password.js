import dotenv from "dotenv";
dotenv.config();
import { createresetkey } from "models/users/resetpassword";
import {
  validatePasswordResetSchema,
  validateSchemapassword,
} from "schemas/reset-password./password-reset.schema";
import { updatepassword } from "services/auth/authservices";
import { withErrorHandler } from "utils/errors/withErrorHandler";

export async function handler(req, res) {
  if (req.method === "POST") {
    let { email } = req.body;
    const data = validatePasswordResetSchema({ email });
    let resetkey = await createresetkey(data.email);
    if (resetkey) {
      res.status(200).json({
        sucess: true,
        message: "email de redefinição enviado com sucesso",
      });
    }
  } else if (req.method === "PATCH") {
    const { key, newpassword } = req.body;

    const data = validateSchemapassword({ newpassword });
    let ok = await updatepassword(key, data.newpassword);
    if (ok) {
      res
        .status(200)
        .json({ sucess: "true", message: "password updated be sucessul!" });
    }
  }
}
export default withErrorHandler(handler);
