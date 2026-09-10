import { NotFoundError } from "utils/errors/error";
import bcrypt from "bcryptjs";
export default async function comparePassword(passwordInput, realpassword) {
  const passwordMatch = await bcrypt.compare(passwordInput, realpassword);
  if (!passwordMatch) {
    throw new NotFoundError([{ field: "user", message: "user not found" }]);
  }
  return true;
}
