import { handleUploadedFile } from "services/file/file-services";
import { removeTempfile } from "utils/helper/file/removeTempFiles";

export async function proccessUsersInput(image) {
  try {
    await handleUploadedFile(image);
    return null;
  } catch (error) {
    await removeTempfile(image.filepath);
    throw error;
  }
}
