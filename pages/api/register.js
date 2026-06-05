import bcrypt from "bcryptjs";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome, email, senha } = req.body;
      let emailtolower = email.toLowerCase();
      const hashedPassword = await bcrypt.hash(senha, 10);
      const result = await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
        [nome, emailtolower, hashedPassword],
      );
      const token = jwt.sign(
        { email, nome, role: "USER", id: result.rows[0].id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      res
        .status(201)
        .json({ message: "User created successfully", token: token });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
