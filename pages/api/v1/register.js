import { registeruser } from "services/auth/authservices";
import { validateSchemaregister } from "schemas/register/register.schema";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { methodNotAllowedError, RegisterError } from "utils/errors/error";
import responseabstration from "utils/response/responseAbstration";

export async function handler(req) {
  if (req.method === "POST") {
    const { nome, email, senha } = req.body;

    const data = validateSchemaregister({
      name: nome,
      email: email,
      password: senha,
    });
    const token = await registeruser(data.name, data.email, data.password);

    if (token.success == false) {
      throw new RegisterError([
        { field: undefined, message: "error on register user" },
      ]);
    } else {
      return responseabstration(201, "successfully registered", [{ token }]);
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
