import { findAllUsers, findUserbyId, softDeleteUser } from "models/users/users";
import assertFound from "utils/helper/assertFound";
import { dateconversion } from "utils/helper/users/dateconversion";
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
  const users_formated = users.map((user) => ({
    ...user,
    created_at: dateconversion(user.created_at),
  }));

  return [{ users: users_formated }];
}
export async function getUserbyidAdmin(user_id, role) {
  await verifyuserRole(role, "view");
  const user = await findUserbyId(user_id);
  assertFound(user, "user");
  return user;
}
export async function getUserbyidUser(user_id) {
  const user = await findUserbyId(user_id);
  const users_formated = user.map((user) => ({
    ...user,
    created_at: dateconversion(user.created_at),
  }));

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
