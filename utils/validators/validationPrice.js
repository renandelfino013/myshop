import { ValidationError } from "utils/errors/error";
export default function validationPrice(price) {
  const regexPrice = /^\d+(\.\d{1,2})?$/;
  if (!regexPrice.test(price)) {
    throw new ValidationError(
      "The price format is invalid. A maximum of 2 decimal places is allowed.",
    );
  }
  return null;
}
