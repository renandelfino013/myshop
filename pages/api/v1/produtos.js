import {
  validateProductSchema,
  validateProductsPerIdSchema,
} from "schemas/products/products.schema";
import validationtoken from "services/auth/validationtoken";
import {
  GetAllproducts,
  GetProductPerId,
  Postproduct,
  Putproduct,
  removeproduct,
} from "services/products/products-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import responseabstration from "utils/response/responseAbstration";

export async function handler(req) {
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  await validationtoken(userId, email, role);

  if (req.method === "GET" && !req.query.id) {
    const products = await GetAllproducts();
    return responseabstration(200, "products found", products);
  } else if (req.method === "GET" && req.query.id) {
    const id = req.query.id;
    const data = validateProductsPerIdSchema({ id });
    const product = await GetProductPerId(data.id);
    return responseabstration(200, "product found", product);
  } else if (req.method === "POST") {
    const { name, price, stock, categoryId, markId, desc } = req.body;
    const data = validateProductSchema({
      name,
      price,
      stock,
      categoryId,
      markId,
      desc,
    });
    await Postproduct(
      data.name,
      data.price,
      data.stock,
      data.categoryId,
      data.markId,
      data.desc,
      role,
    );
    return responseabstration(201, "Product created successfully");
  } else if (req.method === "PUT") {
    const { productid, newname, price, stock, categoryId, markId, desc } =
      req.body;
    const data = validateProductSchema({
      name: newname,
      price,
      stock,
      categoryId,
      markId,
      desc,
      productId: productid,
    });
    await Putproduct(
      data.productId,
      data.name,
      data.price,
      data.stock,
      data.categoryId,
      data.markId,
      data.desc,
      role,
    );
    return responseabstration(200, "Product updated successfully");
  } else if (req.method === "DELETE") {
    const id = req.query.id || req.body?.id;
    const data = validateProductsPerIdSchema({ id });
    await removeproduct(data.id, role);

    return responseabstration(200, "Product deleted successfully");
  } else {
    throw new methodNotAllowedError([
      {
        field: "method",
        message: "Method not allowed",
      },
    ]);
  }
}

export default withErrorHandler(handler);
