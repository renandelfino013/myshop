import bcrypt from "bcryptjs";
import pool from "/utils/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sendLoginNotification } from "/utils/sendEmail";
import { finduserbyemail, insertkey } from "/models/users/users";
import {
  NetworkError,
  NotFoundError,
  SendEmailError,
  ValidationError,
} from "../../utils/error";
dotenv.config();
export async function createresetkey(email) {
  try {
    const consulta = await finduserbyemail(email);
   
    if (consulta.length > 0) {
      const user = consulta[0];
      const resetKey = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" },
      );
      const callresetkey = await insertkey(user.id, resetKey);
      if (callresetkey) {
        let ok = await sendLoginNotification(
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
              <a href="${process.env.FRONTEND_URL}/reset-password?key=${resetKey}" style="display:inline-block; padding:10px 20px; background-color:#1976d2; color:#fff; text-decoration:none; border-radius:5px;">Redefinir Senha</a>
            </div>
          `,
        );
        if (!ok) {
          throw new SendEmailError(
            "erro ao enviar email de redefinição de senha",
          );
        } else {
          return true;
        }

        return true;
      } else {
        throw new NotFoundError("Usuario nao encontrado");
      }
    } else {
      throw new NotFoundError("usuario n encontrado no db");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new NetworkError("failed to fetch users");
  }
}
export async function validationresettoken(key, newpassword) {
  try {
    const result = await pool.query(
      "SELECT usuariosid FROM password_reset_keys WHERE key = $1 AND expirado = FALSE",
      [key],
    );
    return result.rows;


  } catch (error) {
    throw new ValidationError("Reset token invalido!!");
  }
}

export async function updatepassindb(hashedpassword, userid) {
  try {
    const updateResult = await pool.query(
      "UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING id",
      [hashedpassword, userid],
    );

    return updateResult.rows
  } catch (error) {
    throw new ValidationError("error on updating password");
  }
}
export async function expiringResetToken(userId) {
  try {
    let ok = await pool.query(
      "UPDATE password_reset_keys SET expirado = TRUE WHERE usuariosid = $1",
      [userId],
    );
    return ok.rows;
  } catch (error) {
    throw new ValidationError("error on expiring reset token!");
  }
}
