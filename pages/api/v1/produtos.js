import { validatefileSchema } from "schemas/files/files.schemas";
import {
  validateProductSchema,
  validateProductsPerIdSchema,
} from "schemas/products/products.schema";
import {
  GetAllproducts,
  GetProductPerId,
  Postproduct,
  Putproduct,
  removeproduct,
} from "services/products/products-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { parseMultipart } from "utils/helper/file/searchFile";

import responseabstration from "utils/response/responseAbstration";
import { reqValidation } from "utils/validators/auth/reqValidation/req-validation";
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
  if (req.method === "GET" && !req.query.id) {
    const products = await GetAllproducts();
    return responseabstration(200, "products found", products);
  } else if (req.method === "GET" && req.query.id) {
    const id = req.query.id;
    const data = validateProductsPerIdSchema({ id });
    const product = await GetProductPerId(data.id);
    return responseabstration(200, "product found", product);
  } else if (req.method === "POST") {
    const { fields, files } = await parseMultipart(req);

    const name = fields.name?.[0];
    const price = fields.price?.[0];
    const stock = fields.stock?.[0];
    const categoryId = fields.categoryId?.[0];
    const markId = fields.markId?.[0];
    const desc = fields.desc?.[0];

    const image = files.image?.[0] ?? null;

    if (image) {
      const namefile = image.originalFilename;
      const filesize = image.size;
      const mimetype = image.mimetype;

      await validatefileSchema({ namefile, filesize, mimetype });
    }
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
      image,
      role,
    );

    return responseabstration(201, "Product created successfully");
  } else if (req.method === "PUT") {
    const { fields, files } = await parseMultipart(req);

    const newname = fields.newname?.[0];
    const price = fields.price?.[0];
    const stock = fields.stock?.[0];
    const categoryId = fields.categoryId?.[0];
    const markId = fields.markId?.[0];
    const desc = fields.desc?.[0];
    const productId = fields.productId?.[0];

    const image = files.image?.[0] ?? undefined;

    if (image) {
      const namefile = image.originalFilename;
      const filesize = image.size;
      const mimetype = image.mimetype;

      await validatefileSchema({ namefile, filesize, mimetype });
    }
    const data = validateProductSchema({
      name: newname,
      price,
      stock,
      categoryId,
      markId,
      desc,
      productId,
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
