import { validateProductSchema } from "schemas/products/products.schema";
import { handleUploadedFile } from "services/file/file-services";
import { removeTempfile } from "utils/helper/file/removeTempFiles";
/**
 *@param {import('formidable').File} files
 */
export async function proccessProductInput(fields, files) {
  const name = fields.name?.[0] || fields.newname?.[0];
  const price = fields.price?.[0];
  const stock = fields.stock?.[0];
  const categoryId = fields.categoryId?.[0];
  const markId = fields.markId?.[0];
  const desc = fields.desc?.[0];
  const productId = fields.productId?.[0];

  const image = files.image?.[0] ?? undefined;
  try {
    await handleUploadedFile(image);

    const data = validateProductSchema({
      name,
      price,
      stock,
      categoryId,
      markId,
      desc,
      productId,
    });
    return { data, image };
  } catch (error) {
    if (image !== undefined) {
      await removeTempfile(image.filepath);
    }

    throw error;
  }
}
