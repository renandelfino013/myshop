import bcrypt from "bcrypt";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, senha } = req.body;

      const result = await pool.query(
        "SELECT id, nome, email,role ,senha FROM usuarios WHERE email = $1 ",
        [email],
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(senha, user.senha);
        if (passwordMatch) {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
          );
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
