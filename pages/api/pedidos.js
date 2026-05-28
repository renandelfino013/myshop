import jwt from "jsonwebtoken";
import pool from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST" && req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let itens = req.body.itens;
      const bg = await pool.query(
        "INSERT INTO pedidos (usuarios_id) VALUES ($1) RETURNING id",
        [decoded.id],
      );
      const id = decoded.id;
      for (const item of itens) {
        await pool.query(
          "INSERT INTO itens_pedidos (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
          [bg.rows[0].id, item.produto_id, item.quantidade],
        );
      }
      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
