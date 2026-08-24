import { FindCategoryById } from "models/categorys/modelCategorias";
import { NotFoundError } from "utils/errors/error";
import regexid from "utils/Regex/regexId";
export default async function verifyCategoryExist(id) {
  await regexid(id);
  const category = await FindCategoryById(id);
  if (category.length === 0) {
    throw new NotFoundError("Category not found");
  }
}
