import { registerUserInDB } from "models/users/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export async function registeruser(nome, email, senha) {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const result = await registerUserInDB(nome, email, hashedPassword);
  if (result) {
    const token = await jwt.sign(
      { email, nome, role: "USER", id: result.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    return token;
  }
}
