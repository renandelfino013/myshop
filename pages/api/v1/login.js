import bcrypt from "bcryptjs";
import pool from "/utils/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { login } from "/services/authservices";
import { sendLoginNotification } from "/utils/sendEmail";
import { resetpassword } from "/models/users/resetpassword";
import teste from "../../../models/teste.";
dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      teste()
      const { email, senha } = req.body;
      const { user, token } = await login(email, senha);
      res.status(200).json({
        sucess: true,
        message: "Login realizado com sucesso",
        user,
        token,
      });
    } catch (error) {
      console.log("error log : " , error)
      res
        .status(error.statusCode || 500)
        .json({ succes: false, error: error.message, type: error.name });
    }
  }
}
