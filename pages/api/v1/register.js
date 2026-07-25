import { registeruser } from "/services/authservices";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome, email, senha } = req.body;

      const token = await registeruser(nome, email, senha);

      if (token.success == false) {
        res.status(401).json({ error: token.error });
      } else {
        return res
          .status(201)
          .json({ message: "User created successfully", token: token });
      }
    } catch (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Email already exists" });
      } else {
        console.error("Error creating user:", error);
        return res.status(error.statusCode).json({ error: error.message });
      }
    }
  } else {
    return res.status(405).json({ error: "invalid method" });
  }
}
