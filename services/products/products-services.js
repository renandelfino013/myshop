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
import { removeTempfile } from "utils/helper/file/removeTempFiles";
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
  let result;

  try {
    await verifyuserRole(role, context);

    result = await uploadFile(image_file.filepath);

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
    if (result) await deleteFromStorage(result.public_id);
    throw error;
  } finally {
    removeTempfile(image_file.filepath);
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
  let result = 0;

  try {
    await verifyuserRole(role, context);

    if (image_file !== undefined) {
      result = await uploadFile(image_file.filepath);
    }
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
  } finally {
    if (image_file !== undefined) {
      await removeTempfile(image_file.filepath);
    }
  }
}
export async function removeproduct(id, role) {
  const context = "delete";
  await verifyuserRole(role, context);

  const rows = await Deleteproduct(id);
  assertFound(rows, "Product");
  return true;
}
