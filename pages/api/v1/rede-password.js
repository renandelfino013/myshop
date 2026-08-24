import dotenv from "dotenv";
dotenv.config();
import { createresetkey } from "models/users/resetpassword";
import { updatepassword } from "services/auth/authservices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { email } = req.body;
    let resetkey = await createresetkey(email);
    if (resetkey) {
      res.status(200).json({
        sucess: true,
        message: "email de redefinição enviado com sucesso",
      });
    }
  } else if (req.method === "PATCH") {
    const { key, newpassword } = req.body;
    try {
      let ok = await updatepassword(key, newpassword);
      if (ok) {
        res
          .status(200)
          .json({ sucess: "true", message: "password updated be sucessul!" });
      }
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}
