import bcrypt from "bcryptjs";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendLoginNotification } from "../../utils/sendEmail";
dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, senha } = req.body;
      let emailtolower = email.toLowerCase();
      console.log(emailtolower, senha);

      const result = await pool.query(
        "SELECT id, nome, email, role, senha FROM usuarios WHERE email = $1",
        [emailtolower],
      );

      if (result.rows.length > 0) {
        const user = result.rows[0];
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

          if (ok) {
            res.status(200).json({
              message: "Login successful",
              token,
              user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
              },
            });
          } else {
            res
              .status(500)
              .json({ error: "Failed to send login notification email" });
          }
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { email, newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await pool.query(
        "UPDATE usuarios SET senha = $1 WHERE email = $2 RETURNING id",
        [hashedPassword, email],
      );

      if (result.rows.length > 0) {
        try {
          let ok = await sendLoginNotification(
            email,
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

          if (ok) {
            res.status(200).json({ message: "Password updated successfully" });
          } else {
            res.status(500).json({
              error: "Failed to send password change notification email",
            });
          }
        } catch (error) {
          console.error("Error sending password change email:", error);
          res.status(500).json({
            error: "Failed to send password change notification email",
          });
        }
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ error: "Failed to update password" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
