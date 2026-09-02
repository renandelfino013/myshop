import {
  validateSchemaDeletecategory,
  validateSchemaGetcategoryPerId,
  validateSchemaGetcategoryPerName,
  validateSchemaPost,
  validateSchemaPutcategory,
} from "schemas/categorys/category.schema";
import validationtoken from "services/auth/validationtoken";
import {
  GetAllCategorys,
  GetCategoryPerId,
  GetCategoryPerName,
  Postnewcategory,
  PutCategory,
  removeCategory,
} from "services/category/category-services";

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
      const data = validateSchemaGetcategoryPerId({ id });
      const category = await GetCategoryPerId(data.id);
      res.status(200).json(category);
    } else if (req.method === "GET" && req.query.nome) {
      const nome = req.query.nome;
      const data = validateSchemaGetcategoryPerName({ nome });
      const category = await GetCategoryPerName(data.nome);
      res.status(200).json(category);
    } else if (req.method === "POST") {
      const nome = req.body.nome;
      const data = validateSchemaPost({ nome });
      await Postnewcategory(data.nome, role);

      res
        .status(201)
        .json({ success: true, message: "Category sucessfully created" });
    } else if (req.method === "PUT") {
      const { id, novonome } = req.body;
      const data = validateSchemaPutcategory({ id, novonome });
      await PutCategory(data.id, data.novonome, role);
      res
        .status(200)
        .json({ success: true, message: "Category sucessfully updated" });
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      const data = validateSchemaDeletecategory({ id });
      await removeCategory(data.id, role);
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
