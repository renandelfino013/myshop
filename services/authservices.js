import {
  NotFoundError,
  AuthError,
  SendEmailError,
  ValidationError,
  NetworkError,
} from "../utils/error";
import jwt from "jsonwebtoken";
import { findEmailUserbyId, finduserbyemail } from "../models/users/users";
import bcrypt from "bcryptjs";
import {
  updatepassindb,
  expiringResetToken,
} from "../models/users/resetpassword";

import { sendLoginNotification } from "../utils/sendEmail";
import { validationresettoken } from "../models/users/resetpassword";

export async function login(email, senha) {
  let emailtolower = email.toLowerCase();
  console.log(emailtolower, senha);
  try {
    const result = await finduserbyemail(emailtolower);

    if (result.length > 0) {
      const user = result[0];
      const passwordMatch = await bcrypt.compare(senha, user.senha);

      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        let ok = await sendLoginNotification(
          user.email,
          "Notificação de Login - MyShop",
          `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá, ${user.nome} 👋</h2>
              <p style="color:#e3f2fd;">Você acabou de fazer login na sua conta <b>MyShop</b>.</p>
            </div>
          `,
        );

        if ((await ok) == true) {
          return { user, token };
        } else {
          throw new SendEmailError("Failed to send login notification email");
        }
      } else {
        throw new AuthError("Failed to send login notification email");
      }
    } else {
      throw new NotFoundError("User not found");
      return;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new NetworkError(error);
  }
}
export async function updatepassword(key, newpassword) {
  try {
    const result = await validationresettoken(key);
    if (result.length > 0) {
      const userId = result.rows[0].usuariosid;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const UpdatePassInDB = await updatepassindb(hashedPassword, userId);

      if (UpdatePassInDB.length > 0) {
        const expiringretoken = await expiringResetToken(userId);
        const emailResult = await findEmailUserbyId(userId);
        if (emailResult.length > 0) {
          try {
            let ok = await sendLoginNotification(
              emailResult,
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
            if (!ok) {
              throw new SendEmailError(
                "erro ao enviar email de log sobre alteração de  senha",
              );
            }
            return true;
          } catch (error) {
            console.error("Error sending password change email:", error);
          }
        } else {
          console.error("Error fetching user email:", error);
        }

        return true;
      } else {
        throw new Error("Failed to update password");
      }
    } else {
      throw new Error("Invalid or expired reset key");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Failed to reset password");
  }
}
