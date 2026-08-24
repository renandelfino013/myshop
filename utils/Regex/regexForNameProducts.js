import { ValidationError } from "utils/errors/error";

export default function regexForNameProducts(name) {
  const cleanname = name.trim().replace(/\s{2,}/g, " ");

  const regex = /^[a-zA-Z0-9áéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ\s\-/.%"'&]{5,100}$/u;
  if (!regex.test(cleanname)) {
    throw new ValidationError(
      "Product name must be between 5 and 100 characters and contain only letters, numbers, and standard symbols (like -, /, %, &, and ",
    );
  }
  return null;
}
