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
  }
}
