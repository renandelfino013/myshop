import { validateSchemaregister } from "schemas/register/register.schema";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { methodNotAllowedError } from "utils/errors/error";
import responseabstration from "utils/response/responseAbstration";
import { registeruser } from "services/auth/register/register-services";

export async function handler(req) {
  if (req.method === "POST") {
    const { nome, email, senha } = req.body;

    const data = validateSchemaregister({
      name: nome,
      email: email,
      password: senha,
    });
    const token = await registeruser(data.name, data.email, data.password);

    return responseabstration(201, "successfully registered", [{ token }]);
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
