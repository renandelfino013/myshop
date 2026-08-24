import {
  deleteCategory,
  FindAllCategorys,
  FindCategoryById,
  FindCategoryByName,
  InsertNewCategory,
  updateCategory,
} from "models/categorys/modelCategorias";
import { NotFoundError } from "utils/errors/error";
import regexid from "utils/Regex/regexId";
import regexforNameCategorys from "utils/Regex/regexforNameCategorys";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function GetAllCategorys() {
  const categorys = await FindAllCategorys();
  return categorys;
}
export async function GetCategoryPerId(id) {
  await regexid(id);

  const category = await FindCategoryById(id);
  if (category.length === 0) {
    throw new NotFoundError("Category not found");
  }
  return category;
}

export async function GetCategoryPerName(name) {
  const category = await FindCategoryByName(name);
  if (category.length === 0) {
    throw new NotFoundError("Category not found");
  }
  return category;
}
export async function Postnewcategory(name, role) {
  const context = "create";

  await verifyuserRole(role, context);
  await regexforNameCategorys(name);
  await InsertNewCategory(name);
}
export async function PutCategory(id, newname, role) {
  const context = "update";
  await verifyuserRole(role, context);

  await regexid(id);
  await regexforNameCategorys(newname);
  const upd = await updateCategory(id, newname);
  if (upd.length === 0) {
    throw new NotFoundError("Category not found");
  }
}
export async function removeCategory(id, role) {
  const context = "remove";

  await verifyuserRole(role, context);

  await regexid(id);
  const del = await deleteCategory(id);
  if (del.length === 0) {
    throw new NotFoundError("Category not found");
  }
  return null;
}
