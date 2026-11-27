import { ApiError } from "./front-error";

export async function handleApiResponse<T>(res: Response): Promise<T> {
  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(body.message, res.status, body.code, body.details);
  }

  return body;
}
