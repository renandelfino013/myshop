import validationtoken from "services/auth/validationtoken";
import {
  GetAllCategorys,
  GetCategoryPerId,
  GetCategoryPerName,
  Postnewcategory,
  PutCategory,
  removeCategory,
} from "services/category/category-services";
import { ValidationError } from "utils/errors/error";
export default async function handler(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const role = req.headers["x-user-role"];
    await validationtoken(userId, email, role);

    if (req.method === "GET" && Object.keys(req.query).length === 0) {
      const categorys = await GetAllCategorys();
      res.status(200).json(categorys);
    } else if (req.method === "GET" && req.query.id) {
      const id = req.query.id;
      if (!id) {
        throw new ValidationError("id is required!");
      }
      const category = await GetCategoryPerId(id);
      res.status(200).json(category);
    } else if (req.method === "GET" && req.query.nome) {
      const nome = req.query.nome;
      if (!nome) {
        throw new ValidationError("nome is required!");
      }
      const category = await GetCategoryPerName(nome);
      res.status(200).json(category);
    } else if (req.method === "POST") {
      const nome = req.body.nome;
      if (!nome) {
        throw new ValidationError("nome is required!");
      }
      await Postnewcategory(nome, role);

      res
        .status(201)
        .json({ success: true, message: "Category sucessfully created" });
    } else if (req.method === "PUT") {
      const { id, novonome } = req.body;
      await PutCategory(id, novonome, role);
      res
        .status(200)
        .json({ success: true, message: "Category sucessfully updated" });
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) throw new ValidationError("id is required!");
      await removeCategory(id, role);
      res.status(200).json({ success: true, message: "Category deleted" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(error.status || error.statusCode || 500)
      .json({ error: error.message });
  }
}
