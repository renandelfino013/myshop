import dotenv from "dotenv";
import { validateSchemaLogin } from "schemas/login/login.schema";
import { login } from "services/auth/authservices";
import { withErrorHandler } from "utils/errors/withErrorHandler";
dotenv.config();

export async function handler(req, res) {
  if (req.method === "POST") {
    const { email, senha } = req.body;
    const data = validateSchemaLogin({ email, senha });
    const { user, token } = await login(data.email, data.senha);
    res.status(200).json({
      sucess: true,
      message: "Login realizado com sucesso",
      user,
      token,
    });
  }
}

export default withErrorHandler(handler);
