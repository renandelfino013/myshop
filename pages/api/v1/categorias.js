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
import responseabstration from "utils/response/responseAbstration";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";

export async function handler(req) {
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  await validationtoken(userId, email, role);

  if (req.method === "GET" && Object.keys(req.query).length === 0) {
    const categorys = await GetAllCategorys();
    return responseabstration(200, "categorys found", categorys);
  } else if (req.method === "GET" && req.query.id) {
    const id = req.query.id;
    const data = validateSchemaGetcategoryPerId({ id });
    const category = await GetCategoryPerId(data.id);
    return responseabstration(200, "category found", category);
  } else if (req.method === "GET" && req.query.nome) {
    const nome = req.query.nome;
    const data = validateSchemaGetcategoryPerName({ nome });
    const category = await GetCategoryPerName(data.nome);
    return responseabstration(200, "category found", category);
  } else if (req.method === "POST") {
    const nome = req.body.nome;
    const data = validateSchemaPost({ nome });
    await Postnewcategory(data.nome, role);
    return responseabstration(201, "Category created successfully");
  } else if (req.method === "PUT") {
    const { id, novonome } = req.body;
    const data = validateSchemaPutcategory({ id, novonome });
    await PutCategory(data.id, data.novonome, role);
    return responseabstration(200, "Category updated successfully");
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const data = validateSchemaDeletecategory({ id });
    await removeCategory(data.id, role);
    return responseabstration(200, "Category deleted successfully");
  } else {
    throw new methodNotAllowedError([
      {
        field: "method",
        message: "Method not allowed",
      },
    ]);
  }
}

export default withErrorHandler(handler);
