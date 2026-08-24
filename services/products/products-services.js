import {
  Deleteproduct,
  FindAllProducts,
  FindproductPerId,
  FindproductPerName,
  Insertproduct,
  Updateproduct,
} from "models/products/modelProducts";
import { NotFoundError, ValidationError } from "utils/errors/error";
import regexForNameProducts from "utils/Regex/regexForNameProducts";
import proccesnumber from "utils/validators/proccesnumber";
import validationPrice from "utils/validators/validationPrice";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function GetAllproducts() {
  return await FindAllProducts();
}

export async function GetProductPerId(id) {
  const rows = await FindproductPerId(id);
  if (rows.length === 0) {
    throw new NotFoundError("Product not found");
  }
  return rows;
}

export async function GetProductPerName(name) {
  const rows = await FindproductPerName(name);
  if (rows.length === 0) {
    throw new NotFoundError("Product not found");
  }
  return rows;
}

async function validateProduct(name, price, stock, categoryId, markId) {
  if (!name || !price || !stock || !categoryId || !markId) {
    throw new ValidationError(
      "Name, price, stock, category and mark are required to create a product",
    );
  }
  if (price <= 0 || stock < 1) {
    throw new ValidationError(
      "Invalid product values. Price must be greater than 0 and stock must be at least 1.",
    );
  }

  await regexForNameProducts(name);
  await proccesnumber(stock);
  await proccesnumber(markId);
  await proccesnumber(categoryId);
  await validationPrice(price);
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

  await validateProduct(name, price, stock, categoryId, markId);
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

  await validateProduct(newname, price, stock, categoryId, markId);
  const rows = await Updateproduct(
    newname,
    price,
    stock,
    categoryId,
    markId,
    desc,
    productid,
  );
  if (rows.length === 0) {
    throw new NotFoundError("Product not found");
  }
}

export async function removeproduct(id, role) {
  const context = "delete";
  await verifyuserRole(role, context);

  const rows = await Deleteproduct(id);
  if (rows.length === 0) {
    throw new NotFoundError("Product not found");
  }
  return true;
}
