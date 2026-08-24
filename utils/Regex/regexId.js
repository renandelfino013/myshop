import { ValidationError } from "utils/errors/error";

export default function regexid(id) {
  const regexId = /^[1-9]\d*$/;
  if (!regexId.test(id)) {
    throw new ValidationError("Invalid id format");
  }
  return null;
}
