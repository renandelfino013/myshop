import {
  FindAllBrands,
  FindBrandById,
  FindBrandByName,
  InsertNewBrand,
  updatebrand,
  deletebrand,
} from "models/marcas/marcas";
import regexBrandsName from "utils/Regex/regexBrandsName";
import regexidforbrands from "utils/Regex/regexBrandsId";

function NotFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  return error;
}
function ForbiddenError(message) {
  const error = new Error(message);
  error.status = 403;
  return error;
}

function ValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export async function getallbrands() {
  try {
    return await FindAllBrands();
  } catch (error) {
    throw new Error("Error fetching brands: " + error.message);
  }
}

export async function getbrandbyid(id) {
  let str = id.toString();
  await regexidforbrands(str);

  const brand = await FindBrandById(id);
  if (!brand || brand.length === 0) {
    throw NotFoundError("Brand not found");
  }
  return brand;
}
export async function getbrandbyname(name) {
  const brand = await FindBrandByName(name);
  if (!brand || brand.length === 0) {
    throw NotFoundError("Brand not found");
  }
  return brand;
}

export async function createbrand(name, role) {
  const context = "create";
  await verifyuserRole(role, context);
  await createabrandvalidation(name);
  await regexBrandsName(name);
  return InsertNewBrand(name);
}

async function createabrandvalidation(name) {
  if (!name) {
    throw ValidationError("Brand name is required");
  }
  const existingBrand = await FindBrandByName(name);
  if (existingBrand.length > 0) {
    throw ValidationError("Brand already exists");
  }
  return null;
}
export async function renameBrand(brandname, newname, role) {
  const context = "rename";
  await verifyuserRole(role, context);
  if (!brandname || !newname) {
    throw ValidationError("brandname and newname are required");
  }

  const id = await verifyBrandExist(brandname);
  await createabrandvalidation(newname);
  await regexBrandsName(newname);
  const updatedBrand = await updatebrand(id, newname);
  return updatedBrand;
}
export async function removebrand(name, role) {
  const context = "remove";
  await verifyuserRole(role, context);
  if (!name) {
    throw ValidationError("Brand name is required");
  }
  const id = await verifyBrandExist(name);
  await deletebrand(id);
  return true;
}
export async function verifyBrandExist(name) {
  const findbrand = await FindBrandByName(name);
  if (!findbrand || findbrand.length === 0) {
    throw NotFoundError("brand not found");
  }
  return findbrand[0].id;
}
export async function verifyuserRole(role, context) {
  if (role !== "ADMIN") {
    throw ForbiddenError(`User does not have permission to ${context} a brand`);
  }
  return null;
}
