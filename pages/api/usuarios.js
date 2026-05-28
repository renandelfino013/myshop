import bcrypt from "bcrypt";
import pool from "../../utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { email, senha } = req.body;

      const result = await pool.query(
        "SELECT id, nome, email ,senha FROM usuarios WHERE email = $1 ",
        [email],
      );
      res.status(200).json(result.rows);
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
            user: { id: user.id, nome: user.nome, email: user.email },
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "POST") {
    try {
      const { nome, email, senha } = req.body;
      const hashedPassword = await bcrypt.hash(senha, 10);
      const result = await pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
        [nome, email, hashedPassword],
      );
      const token = jwt.sign(
        { email, nome, id: result.rows[0].id },
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
