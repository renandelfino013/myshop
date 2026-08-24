import { ValidationError } from "utils/errors/error";
export default async function proccesnumber(number) {
  if (!Number.isInteger(number)) {
    throw new ValidationError(
      "The value of stock , markId and categoryId must be an integer. Decimals are not allowed.",
    );
  }
  return null;
}
