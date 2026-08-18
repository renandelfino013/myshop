import { ValidationError } from "utils/error";
export default function regexBrandsName(name) {
  const regex = /^\p{L}{3}[\p{L}0-9 ]{0,17}$/u;
  if (!regex.test(name)) {
    throw new ValidationError(
      "The name of brand must have 3,20 characters and start with letters.",
    );
  }
  return null;
}
