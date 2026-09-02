import dotenv from "dotenv";
import { validateSchemaLogin } from "schemas/login/login.schema";
import { login } from "services/auth/authservices";
dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, senha } = req.body;
      const data = validateSchemaLogin({ email, senha });
      const { user, token } = await login(data.email, data.senha);
      res.status(200).json({
        sucess: true,
        message: "Login realizado com sucesso",
        user,
        token,
      });
    } catch (error) {
      console.error("error log : ", error);
      res
        .status(error.statusCode || 500)
        .json({ succes: false, error: error.message, type: error.name });
    }
  }
}
