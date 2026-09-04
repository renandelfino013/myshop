import { registeruser } from "services/auth/authservices";
import { validateSchemaregister } from "schemas/register/register.schema";
import { withErrorHandler } from "utils/errors/withErrorHandler";

export async function handler(req, res) {
  if (req.method === "POST") {
    const { nome, email, senha } = req.body;

    const data = validateSchemaregister({
      name: nome,
      email,
      password: senha,
    });
    const token = await registeruser(data.name, data.email, data.password);

    if (token.success == false) {
      res.status(401).json({ error: token.error });
    } else {
      return res
        .status(201)
        .json({ message: "User created successfully", token: token });
    }
  } else {
    return res.status(405).json({ error: "invalid method" });
  }
}
export default withErrorHandler(handler);
