import {
  deleteCategory,
  FindAllCategorys,
  FindCategoryById,
  FindCategoryByName,
  InsertNewCategory,
  updateCategory,
} from "models/categorys/modelCategorias";
import assertFound from "utils/helper/assertFound";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function GetAllCategorys() {
  const categorys = await FindAllCategorys();
  return categorys;
}
export async function GetCategoryPerId(id) {
  const category = await FindCategoryById(id);
  assertFound(category, "Category");
  return category;
}

export async function GetCategoryPerName(name) {
  const category = await FindCategoryByName(name);
  assertFound(category, "Category");
  return category;
}
export async function Postnewcategory(name, role) {
  const context = "create";
  await verifyuserRole(role, context);
  await InsertNewCategory(name);
}
export async function PutCategory(id, newname, role) {
  const context = "update";
  await verifyuserRole(role, context);

  const upd = await updateCategory(id, newname);
  assertFound(upd, "Category");
}
export async function removeCategory(id, role) {
  const context = "remove";

  await verifyuserRole(role, context);

  const del = await deleteCategory(id);
  assertFound(del, "Category");
  return null;
}
