import { alreadyExistsError } from "utils/errors/error";

export default function alreadyExist(array, context) {
  if (array.length !== 0 && array[0].length !== 0) {
    throw new alreadyExistsError([
      {
        field: context.toLowerCase(),
        message: `${context} already exists!`,
      },
    ]);
  }
  return null;
}
