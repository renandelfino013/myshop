import bcrypt from "bcryptjs";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, senha } = req.body;
      console.log(email, senha);

      const result = await pool.query(
        "SELECT id, nome, email,role ,senha FROM usuarios WHERE email = $1 ",
        [email],
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log("User found:", user);
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (passwordMatch) {
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
          );
          async function sendLoginNotification() {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

            let mailOptions = {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: "notificação de login",
              text: `olá, ${user.nome},\n\nvocê fez login em sua conta.\n\nse não foi você, por favor, altere sua senha imediatamente.\n\natenciosamente,\nmyshop`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error("Error sending email:", error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          }
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
          res.status(401).json({ error: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
}
