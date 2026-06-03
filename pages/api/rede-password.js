import bcrypt from "bcryptjs";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let { email } = req.body;
      let emailtolower = email.toLowerCase();

      let consulta = await pool.query(
        "SELECT id , email , nome FROM usuarios WHERE email = $1 ",
        [emailtolower],
      );
      if (consulta.rows.length > 0) {
        const user = consulta.rows[0];
        const resetKey = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "10m" },
        );
        let insertkey = await pool.query(
          "INSERT INTO password_reset_keys (usuariosid, key) VALUES ($1, $2)  ON CONFLICT (usuariosid) DO UPDATE SET key = EXCLUDED.key, expirado = FALSE",
          [user.id, resetKey],
        );
        if (insertkey) {
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
        }

        console.log(email);
      } else {
        res.status(404).json({ error: "Usuário não encontrado" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { key, newPassword } = req.body;
      const result = await pool.query(
        "SELECT usuariosid FROM password_reset_keys WHERE key = $1 AND expirado = FALSE",
        [key],
      );
      if (result.rows.length > 0) {
        const userId = result.rows[0].usuariosid;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateResult = await pool.query(
          "UPDATE usuarios SET senha = $1 WHERE id = $2 RETURNING id",
          [hashedPassword, userId],
        );
        if (updateResult.rows.length > 0) {
          await pool.query(
            "UPDATE password_reset_keys SET expirado = TRUE WHERE usuariosid = $1",
            [userId],
          );
          let emailResult = await pool.query(
            "SELECT email FROM usuarios WHERE id = $1",
            [userId],
          );
          if (emailResult.rows.length > 0) {
            try {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: process.env.EMAIL_USE,
                  pass: process.env.EMAIL_PASS,
                },
              });
              transporter.sendMail({
                from: process.env.EMAIL_USE,
                to: emailResult.rows[0].email,
                subject: "Senha Redefinida - MyShop",
                html: `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá, 👋</h2>
              <p style="color:#e3f2fd;">Sua senha para a conta <b>MyShop</b> foi redefinida com sucesso.</p>
            </div>
          `,
              });
            } catch (error) {
              console.error("Error sending password change email:", error);
            }
          } else {
            console.error("Error fetching user email:", error);
          }

          res.status(200).json({ message: "Password updated successfully" });
        } else {
          res.status(500).json({ error: "Failed to update password" });
        }
      } else {
        res.status(400).json({ error: "Invalid or expired reset key" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  } else {
    res.status(404).json({ error: "Usuário não encontrado" });
  }
}
