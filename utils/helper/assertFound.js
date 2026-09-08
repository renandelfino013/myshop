import { NotFoundError } from "utils/errors/error";

export default function assertFound(array, context) {
  if (array.length === 0 || array[0].length === 0) {
    throw new NotFoundError([
      {
        field: context.toLowerCase(),
        message: `${context} not found!`,
      },
    ]);
  }
  return null;
}
