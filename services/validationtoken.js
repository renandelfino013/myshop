import { finduserbyemail } from "models/users/users";
import { ValidationError } from "utils/error";
export default async function validationtoken(userid, email) {
  const result = await finduserbyemail(email);
  if (result.length === 0) {
    throw new ValidationError("User not found");
  }
  return true;
}
