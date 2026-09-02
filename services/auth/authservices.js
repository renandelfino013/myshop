import {
  NotFoundError,
  AuthError,
  NetworkError,
  SendEmailError,
} from "utils/errors/error";
import jwt from "jsonwebtoken";
import { findEmailUserbyId, finduserbyemail } from "models/users/users";
import bcrypt from "bcryptjs";
import { updatepassindb } from "models/users/resetpassword";
import { expiringResetToken } from "models/users/resetpassword";
import { sendLoginNotification } from "utils/mail/sendEmail";
import { validationresettoken } from "models/users/resetpassword";
import { registerUserInDB } from "models/users/users";

export async function login(email, senha) {
  let emailtolower = email.toLowerCase();
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
        try {
          await sendLoginNotification(
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
        } catch (error) {
          throw new NetworkError("erro ao enviar email de login!", error);
        }
        return { user, token };
      } else {
        throw new AuthError("email or password invalid");
      }
    } else {
      throw new NotFoundError("User not found");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new NetworkError(error);
  }
}
export async function updatepassword(key, newpassword) {
  try {
    const result = await validationresettoken(key);

    if (result.length > 0 && result[0] !== undefined) {
      const userId = result[0].usuariosid;
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const UpdatePassInDB = await updatepassindb(hashedPassword, userId);

      if (UpdatePassInDB.length > 0) {
        await expiringResetToken(userId);

        const emailResult = await findEmailUserbyId(userId);

        if (emailResult.length > 0) {
          try {
            await sendLoginNotification(
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
          } catch (error) {
            console.error(error);

            throw new SendEmailError("Error sending password change email:");
          }
        } else {
          throw new SendEmailError("Error fetching user email:");
        }

        return true;
      } else {
        throw new AuthError("Failed to update password");
      }
    } else {
      throw new Error("Invalid or expired reset key");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Failed to reset password: " + error.message);
  }
}

export async function registeruser(nome, email, senha) {
  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const result = await registerUserInDB(nome, email, hashedPassword);
    if (result) {
      const token = await jwt.sign(
        { email, nome, role: "USER", id: result.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      return token;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
