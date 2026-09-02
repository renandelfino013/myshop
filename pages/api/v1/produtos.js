import {
  validateProductSchema,
  validateProductsPerIdSchema,
} from "schemas/products/products.schema";
import validationtoken from "services/auth/validationtoken";
import {
  GetAllproducts,
  GetProductPerId,
  Postproduct,
  Putproduct,
  removeproduct,
} from "services/products/products-services";

export default async function handler(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const role = req.headers["x-user-role"];
    await validationtoken(userId, email, role);

    if (req.method === "GET" && !req.query.id) {
      const products = await GetAllproducts();
      res.status(200).json(products);
    } else if (req.method === "GET" && req.query.id) {
      const id = req.query.id;
      const data = validateProductsPerIdSchema({ id });
      const product = await GetProductPerId(data.id);
      res.status(200).json(product);
    } else if (req.method === "POST") {
      const { name, price, stock, categoryId, markId, desc } = req.body;
      const data = validateProductSchema({
        name,
        price,
        stock,
        categoryId,
        markId,
        desc,
      });
      await Postproduct(
        data.name,
        data.price,
        data.stock,
        data.categoryId,
        data.markId,
        data.desc,
        role,
      );
      res
        .status(201)
        .json({ success: true, message: "Product created successfully" });
    } else if (req.method === "PUT") {
      const { productid, newname, price, stock, categoryId, markId, desc } =
        req.body;
      const data = validateProductSchema({
        name: newname,
        price,
        stock,
        categoryId,
        markId,
        desc,
        productId: productid,
      });
      await Putproduct(
        data.productId,
        data.name,
        data.price,
        data.stock,
        data.categoryId,
        data.markId,
        data.desc,
        role,
      );
      res
        .status(200)
        .json({ success: true, message: "Product updated successfully" });
    } else if (req.method === "DELETE") {
      const id = req.query.id || req.body?.id;
      const data = validateProductsPerIdSchema({ id });
      await removeproduct(data.id, role);
      res
        .status(200)
        .json({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(error.status || error.statusCode || 500)
      .json({ error: error.message });
  }
}
