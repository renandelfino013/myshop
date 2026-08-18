import { ValidationError } from "utils/error";

export default function regexidforbrands(id) {
  const regexId = /^[1-9]\d*$/;
  if (!regexId.test(id)) {
    throw new ValidationError("Invalid id format");
  }
  return null;
}
