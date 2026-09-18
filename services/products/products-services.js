import {
  Deleteproduct,
  FindAllProducts,
  FindproductPerId,
  FindproductPerName,
  Insertproduct,
  Updateproduct,
} from "models/products/modelProducts";
import { deleteFromStorage, uploadFile } from "services/file/file-services";
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
  image_file,
  role,
) {
  const context = "create";
  await verifyuserRole(role, context);
  const result = await uploadFile(image_file.filepath);
  try {
    await Insertproduct(
      name,
      price,
      stock,
      categoryId,
      markId,
      desc,
      result.secure_url ?? null,
    );
  } catch (error) {
    await deleteFromStorage(result.public_id);
    throw error;
  }
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
  image_file,
) {
  const context = "modify";
  await verifyuserRole(role, context);
  let result = 0;
  if (image_file !== undefined) {
    result = await uploadFile(image_file.filepath);
  }
  try {
    const rows = await Updateproduct(
      newname,
      price,
      stock,
      categoryId,
      markId,
      desc,
      productid,
      result.secure_url ?? undefined,
    );
    assertFound(rows, "Product");
  } catch (error) {
    if (result) await deleteFromStorage(result.public_id);
    throw error;
  }
}
export async function removeproduct(id, role) {
  const context = "delete";
  await verifyuserRole(role, context);

  const rows = await Deleteproduct(id);
  assertFound(rows, "Product");
  return true;
}
