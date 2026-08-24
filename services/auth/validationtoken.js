import { finduserbyemail } from "models/users/users";
import { NotFoundError } from "utils/errors/error";
export default async function validationtoken(userid, email) {
  const result = await finduserbyemail(email);
  if (result.length === 0) {
    throw new NotFoundError("User not found");
  }
  return true;
}
