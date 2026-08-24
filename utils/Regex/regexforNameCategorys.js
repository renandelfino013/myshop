import { ValidationError } from "utils/errors/error";

export default function regexforNameCategorys(name) {
  const regexCategoria = /^[a-zA-ZÀ-ÿ]{2}[a-zA-ZÀ-ÿ0-9\s]{0,38}$/;
  if (!regexCategoria.test(name.trim())) {
    throw new ValidationError(
      "const CATEGORY_ERROR_MESSAGE = Invalid category name. Use only letters, numbers, spaces, and hyphens, between 2 and 40 characters.",
    );
  }
  return null;
}
