import bcrypt from "bcryptjs";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sendLoginNotification } from "../../utils/sendEmail";
import { finduserbyemail, insertkey } from "../../models/users/users";
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
    console.log(
      `consulta log  ${JSON.stringify(consulta, null, 2)} , ${consulta.length}`,
    );
    if (consulta.length > 0) {
      const user = consulta[0];
      console.log(user.id);
      const resetKey = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" },
      );
      console.log(resetKey);
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
        /*
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USE,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USE,
          to: user.email,
          subject: "Recuperação de Senha - MyShop",
          html: `
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
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ error: "Failed to send email" });
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Password reset email sent" });
          }
        });
      }*/ if (!ok) {
          throw new SendEmailError(
            "erro ao enviar email de redefinição de senha",
          );
        } else {
          return true;
        }

        console.log(email);
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
export async function validationresettoken(key, newPassword) {
  try {
    const result = await pool.query(
      "SELECT usuariosid FROM password_reset_keys WHERE key = $1 AND expirado = FALSE",
      [key],
    );
  } catch (error) {
    throw new ValidationError("Reset token invalido!!");
  }
  return result.rows.length;
}

export async function updatepassindb(hashedpassword, userid) {
  try {
    const updateResult = await pool.query(
      "UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING id",
      [hashedPassword, userId],
    );
  } catch (error) {
    throw new ValidationError("error on updating password");
  }
}
export async function expiringResetToken() {
  try {
    let ok = await pool.query(
      "UPDATE password_reset_keys SET expirado = TRUE WHERE usuariosid = $1",
      [userId],
    );
    return ok.rows.length;
  } catch (error) {
    throw new ValidationError("error on expiring reset token!");
  }
}
