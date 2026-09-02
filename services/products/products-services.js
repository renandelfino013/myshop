import {
  Deleteproduct,
  FindAllProducts,
  FindproductPerId,
  FindproductPerName,
  Insertproduct,
  Updateproduct,
} from "models/products/modelProducts";
import assertFound from "utils/helper/assertFound";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function GetAllproducts() {
  return await FindAllProducts();
}

export async function GetProductPerId(id) {
  const rows = await FindproductPerId(id);
  assertFound(rows, "Product");
  return rows;
}

export async function GetProductPerName(name) {
  const rows = await FindproductPerName(name);
  assertFound(rows, "Product");
  return rows;
}

export async function Postproduct(
  name,
  price,
  stock,
  categoryId,
  markId,
  desc,
  role,
) {
  const context = "create";
  await verifyuserRole(role, context);

  await Insertproduct(name, price, stock, categoryId, markId, desc);
}

export async function Putproduct(
  productid,
  newname,
  price,
  stock,
  categoryId,
  markId,
  desc,
  role,
) {
  const context = "modify";
  await verifyuserRole(role, context);

  const rows = await Updateproduct(
    newname,
    price,
    stock,
    categoryId,
    markId,
    desc,
    productid,
  );
  assertFound(rows, "Product");
}

export async function removeproduct(id, role) {
  const context = "delete";
  await verifyuserRole(role, context);

  const rows = await Deleteproduct(id);
  assertFound(rows, "Product");
  return true;
}
