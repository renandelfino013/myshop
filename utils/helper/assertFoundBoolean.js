import { AuthError } from "utils/errors/error";

export default function assertFoundBoolean(condition, fields, message) {
  if (!condition) {
    throw new AuthError([
      {
        field: fields.toLowerCase(),
        message: message,
      },
    ]);
  }
  return null;
}
