import { NotFoundError, ValidationError } from "utils/errors/error";
import {
  FindproductPerId,
  FindproductPerName,
} from "models/products/modelProducts";
import regexid from "utils/Regex/regexId";
import regexForNameProducts from "utils/Regex/regexForNameProducts";
export default async function verifyProductExist(name, id) {
  async function perid(id) {
    await regexid(id);
    const product = await FindproductPerId(id);
    if (!product || product.length === 0) {
      throw NotFoundError("product not found");
    }
    return null;
  }
  async function pername(name) {
    await regexForNameProducts(name);
    const product = await FindproductPerName(name);
    if (!product || product.length === 0) {
      throw NotFoundError("product not found");
    }
    return null;
  }
  if (!name && id) {
    await perid(id);
  } else if (!id && name) {
    await pername(name);
  } else if ((!name, !id)) {
    throw new ValidationError("are required name or id");
  } else {
    await perid(id);
  }
}
