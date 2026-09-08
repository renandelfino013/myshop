import dotenv from "dotenv";
import { validateSchemaLogin } from "schemas/login/login.schema";
import { login } from "services/auth/authservices";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseabstration from "utils/response/responseAbstration";
dotenv.config();

export async function handler(req) {
  if (req.method === "POST") {
    const { email, senha } = req.body;
    const data = validateSchemaLogin({ email, senha });
    const { token } = await login(data.email, data.senha);
    return responseabstration(200, "successfully logged in", { token });
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
