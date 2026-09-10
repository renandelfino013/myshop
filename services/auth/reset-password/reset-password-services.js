import {
  findEmailUserbyId,
  finduserbyemail,
  insertkey,
} from "models/users/users";
import bcrypt from "bcryptjs";
import { updatepassindb } from "models/users/resetpassword";
import { expiringResetToken } from "models/users/resetpassword";
import { sendEmailNotification } from "utils/mail/sendEmail";
import { validationResetTokenByKey } from "utils/validators/reset-token/validation-Reset-token";
import jwt from "jsonwebtoken";
export async function updatepassword(key, newpassword) {
  try {
    const userId = await validationResetTokenByKey(key);
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await updatepassindb(hashedPassword, userId);

    await expiringResetToken(userId);

    const emailResult = await findEmailUserbyId(userId);

    sendEmailNotification(
      emailResult[0].email,
      "Notificação de Alteração de Senha - MyShop",
      `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá,</h2>
              <p style="color:#e3f2fd;">Sua senha da conta <b>MyShop</b> foi alterada com sucesso.</p>
            </div>
          `,
    );

    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
export async function createresetkey(email) {
  const consulta = await finduserbyemail(email);
  //You should return true to prevent it from leaking that an email exists in the system.
  if (consulta.length === 0) return true;

  const user = consulta[0];

  const keyreset = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "10m" },
  );
  await insertkey(user.id, keyreset);

  sendEmailNotification(
    user.email,
    "Recuperação de Senha - MyShop",
    `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá, ${user.nome} 👋</h2>
              <p style="color:#e3f2fd;">Você solicitou a recuperação de senha para sua conta <b>MyShop</b>.</p>
              <p style="color:#e3f2fd;">Clique no link abaixo para redefinir sua senha. Este link é válido por 10 minutos.</p>
              <a href="${process.env.FRONTEND_URL}/reset-password?key=${keyreset}" style="display:inline-block; padding:10px 20px; background-color:#1976d2; color:#fff; text-decoration:none; border-radius:5px;">Redefinir Senha</a>
            </div>
          `,
  );
}
