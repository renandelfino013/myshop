import { ForbiddenError } from "utils/errors/error";
export default async function verifyuserRole(role, context) {
  if (role !== "ADMIN") {
    throw new ForbiddenError(`User does not have permission to ${context}`);
  }
  return null;
}
