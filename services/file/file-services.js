import cloudinary from "infra/cloudinary/cloudinary";
import { requestContext } from "infra/request-context/request-context";
import { validatefileSchema } from "schemas/files/files.schemas";
export async function uploadFile(file) {
  if (!file) {
    return false;
  }
  try {
    const { storageProvider } = requestContext.getStore();

    if (storageProvider === "fake") {
      return { secure_url: "https:testedafeat.com.br", public_id: 21414112 };
    }
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "image",
      folder: `${process.env.NODE_ENV}`,
    });
    return result;
  } catch (error) {
    console.error("error on add a image", error);
    throw error;
  }
}

export async function deleteFromStorage(file_public_id) {
  await cloudinary.uploader.destroy(file_public_id, {
    resource_type: "image",
    invalidate: true,
  });
}

/**
 * Represents a book.
 * @param {import('formidable').File} file
 * @returns {Promise<Object>} - file object
 */
export async function handleUploadedFile(file) {
  if (!file) return null;

  await validatefileSchema({
    namefile: file.originalFilename,
    filesize: file.size,
    mimetype: file.mimetype,
  });

  return null;
}
