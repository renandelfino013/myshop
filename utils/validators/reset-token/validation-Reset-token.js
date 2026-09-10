import { FindResetToken } from "models/users/resetpassword";
import { UnauthorizedError } from "utils/errors/error";
export async function validationResetTokenByKey(key) {
  const result = await FindResetToken(key);
  if (result.length === 0) {
    throw new UnauthorizedError("Invalid or expired reset key");
  }
  return result[0].usuariosid;
}
