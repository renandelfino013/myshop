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

      //await pool.query(
      //  "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
      //   [bg.rows[0].id, item.produto_id, item.quantidade],
      // );
      await Promise.all(
        itens.map((item) =>
          pool.query(
            "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
            [bg.rows[0].id, item.produto_id, item.quantidade],
          ),
        ),
      );

      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  } else if (req.method === "GET") {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.role);
      if (decoded.role === "USER") {
        let result = await pool.query(
          "SELECT u.nome as usuario_nome,u.id as usuario_id,u.email as usuario_email,u.role as usuario_role,pr.nome as produto_nome,pr.preco as produto_preco,p.id as pedido_id, p.data_pedido, i.produto_id, i.quantidade, (i.quantidade * pr.preco) as totalprice  FROM pedidos p JOIN itens_pedido i ON p.id = i.pedido_id JOIN usuarios u ON p.usuarios_id = u.id JOIN produtos pr ON i.produto_id = pr.id = pr.id WHERE p.usuarios_id = $1",
          [decoded.id],
        );

        console.log(result.rows);
        res.status(200).json(result.rows);
      } else if (decoded.role === "ADMIN") {
        let result = await pool.query(
          "SELECT u.nome as usuario_nome,u.id as usuario_id,u.email as usuario_email,u.role as usuario_role,pr.nome as produto_nome,pr.preco as produto_preco,p.id as pedido_id, p.data_pedido, i.produto_id, i.quantidade, (i.quantidade * pr.preco) as totalprice  FROM pedidos p JOIN itens_pedido i ON p.id = i.pedido_id JOIN usuarios u ON p.usuarios_id = u.id JOIN produtos pr ON i.produto_id = pr.id",
        );
        console.log(result.rows);
        res.status(200).json(result.rows);
      } else {
        return res.status(403).json({ error: "Role not permitted" });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
