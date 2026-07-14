import bcrypt from "bcryptjs";
import pool from "/utils/db";
import jwt from "jsonwebtoken";
import { registerUserInDB } from "/models/users/users";
import { registeruser } from "/services/authservices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome, email, senha } = req.body;

      const token = await registeruser(nome, email, senha);

      if (token.success == false) {
        res.status(401).json({ error: token.error });
      } else {
        res
          .status(201)
          .json({ message: "User created successfully", token: token });
      }
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Email already exists" });
      } else {
        console.error("Error creating user:", error);
        res.status(error.statusCode).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: error.message });
  }
}
