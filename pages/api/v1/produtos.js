import pool from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM produtos");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
    if (req.method === "GET" && req.body.produto_id) {
      try {
        const result = await pool.query(
          "SELECT * FROM produtos WHERE id = $1",
          [req.body.produto_id],
        );
        res.status(200).json(result.rows);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
      }
    }
  } else if (req.method === "POST") {
    try {
      const { nome, preco, estoque, categoria_id } = req.body;
      await pool.query(
        "INSERT INTO produtos (nome, preco ,estoque,categoria_id) VALUES ($1, $2, $3 , $4)",
        [nome, preco, estoque, categoria_id],
      );
      res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.error("Error adding product:", error);
      console.error(error);
      res.status(500).json({ error: "Failed to add product" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, nome, preco, estoque, categoria_id } = req.body;
      await pool.query(
        "UPDATE produtos SET nome = $1, preco = $2, estoque = $3, categoria_id = $4 WHERE id = $5",
        [nome, preco, estoque, categoria_id, id],
      );
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}
