import {
  FindAllBrands,
  FindBrandById,
  FindBrandByName,
  InsertNewBrand,
  updatebrand,
  deletebrand,
} from "models/marcas/marcas";
import { ValidationError } from "utils/errors/error";
import assertFound from "utils/helper/assertFound";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function getallbrands() {
  try {
    return await FindAllBrands();
  } catch (error) {
    throw new Error("Error fetching brands: " + error.message);
  }
}

export async function getbrandbyid(id) {
  const brand = await FindBrandById(id);
  assertFound(brand, "Brand");
  return brand;
}
export async function getbrandbyname(name) {
  const brand = await FindBrandByName(name);
  assertFound(brand, "Brand");
  return brand;
}

export async function createbrand(name, role) {
  const context = "create";
  await verifyuserRole(role, context);
  await createabrandvalidation(name);
  return InsertNewBrand(name);
}

async function createabrandvalidation(name) {
  const existingBrand = await FindBrandByName(name);
  if (existingBrand.length > 0) {
    throw new ValidationError("Brand already exists", "Brand");
  }
  return null;
}
export async function renameBrand(brandname, newname, role) {
  const context = "rename";
  await verifyuserRole(role, context);

  const id = await verifyBrandExist(brandname);
  await createabrandvalidation(newname);
  const updatedBrand = await updatebrand(id, newname);
  return updatedBrand;
}
export async function removebrand(name, role) {
  const context = "remove";
  await verifyuserRole(role, context);
  const id = await verifyBrandExist(name);
  await deletebrand(id);
  return true;
}
export async function verifyBrandExist(name) {
  const findbrand = await FindBrandByName(name);
  assertFound(findbrand, "Brand");
  return findbrand[0].id;
}
