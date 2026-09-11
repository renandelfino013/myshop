import { finduserbyemail } from "models/users/users";
import { NotFoundError, UnauthorizedError } from "utils/errors/error";
export default async function validationtoken(email, session_version) {
  const result = await finduserbyemail(email);

  const numbersession = Number(session_version);

  if (result.length === 0) {
    throw new NotFoundError([{ field: undefined, message: "User not found" }]);
  } else if (numbersession !== result[0].session_version) {
    throw new UnauthorizedError([{ field: "token", message: "invalid token" }]);
  }

  return null;
}
