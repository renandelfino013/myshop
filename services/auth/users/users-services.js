import {
  findAllUsers,
  findUserbyId,
  InsertImageOnUser,
  softDeleteUser,
} from "models/users/users";
import { deleteFromStorage, uploadFile } from "services/file/file-services";
import assertFound from "utils/helper/assertFound";
import { removeTempfile } from "utils/helper/file/removeTempFiles";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function getAllUsersAdmin(limit, page, role) {
  await verifyuserRole(role, "view");
  if (!page || page === 0) {
    page = 1;
  }
  if (!limit) {
    limit = 30;
  }

  const users = await findAllUsers(limit, page);

  return [{ users }];
}
export async function getUserbyidAdmin(user_id, role) {
  await verifyuserRole(role, "view");
  const user = await findUserbyId(user_id);
  assertFound(user, "user");
  return user;
}
export async function getUserbyidUser(user_id) {
  const user = await findUserbyId(user_id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const users_formated = user.map(({ session_version, ...rest }) => rest);

  assertFound(user, "user");
  return users_formated;
}
export async function softRemoveUserAdmin(user_id, role) {
  await verifyuserRole(role, "remove");
  const deleted = await softDeleteUser(user_id);
  await assertFound(deleted, "user");
  return null;
}

export async function softRemoveMyUser(user_id) {
  const deleted = await softDeleteUser(user_id);
  await assertFound(deleted, "user");
  return true;
}
export async function PostUserImage(image, user_id) {
  let upload;
  try {
    upload = await uploadFile(image.filepath);

    const result = await InsertImageOnUser(upload.secure_url, user_id);
    assertFound(result, "user");
    return null;
  } catch (error) {
    if (upload) {
      await deleteFromStorage(upload.public_id);
    }
    throw error;
  } finally {
    removeTempfile(image.filepath);
  }
}
