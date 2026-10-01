import { validateProductsPerIdSchema } from "schemas/products/products.schema";
import { validateSearchSchema } from "schemas/search/search.schemas";
import {
  GetAllproducts,
  GetProductPerId,
  GetsearchProduct,
  Postproduct,
  Putproduct,
  removeproduct,
} from "services/products/products-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { parseMultipart } from "utils/helper/file/searchFile";
import { offsetAndPageProccess } from "utils/helper/search/offsetAndPageProccess";

import responseabstration from "utils/response/responseAbstration";
import { reqValidation } from "utils/validators/auth/reqValidation/req-validation";
import { proccessProductInput } from "utils/validators/products/proccessProductInput";
/**
 * @param {Request} req
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
export async function handler(req) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  const session_version = req.headers["x-user-session_version"];

  await reqValidation(email, session_version, Boolean(role));
  if (req.method === "GET" && !req.query.id && !req.query.search) {
    const { page, limit } = req.query;
    const processed = offsetAndPageProccess(page, limit);

    const products = await GetAllproducts(processed.offset, processed.limit);
    return responseabstration(200, "products found", products);
  } else if (req.method === "GET" && req.query.id) {
    const id = req.query.id;
    const data = validateProductsPerIdSchema({ id });
    const product = await GetProductPerId(data.id);
    return responseabstration(200, "product found", product);
  } else if (req.method === "GET" && req.query.search) {
    const { search, page, limit } = req.query;
    const processed = offsetAndPageProccess(page, limit);
    const data = validateSearchSchema({ search });

    const product = await GetsearchProduct(
      data.search,
      processed.limit,
      processed.offset,
    );
    return responseabstration(200, "product found", product);
  } else if (req.method === "POST") {
    const { fields, files } = await parseMultipart(req);

    const { data, image } = await proccessProductInput(fields, files);

    await Postproduct(
      data.name,
      data.price,
      data.stock,
      data.categoryId,
      data.markId,
      data.desc,
      image,
      role,
    );

    return responseabstration(201, "Product created successfully");
  } else if (req.method === "PUT") {
    const { fields, files } = await parseMultipart(req);

    const { data, image } = await proccessProductInput(fields, files);

    await Putproduct(
      data.productId,
      data.name,
      data.price,
      data.stock,
      data.categoryId,
      data.markId,
      data.desc,
      role,
      image,
    );
    return responseabstration(200, "Product updated successfully");
  } else if (req.method === "DELETE") {
    const id = req.query.id;
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
