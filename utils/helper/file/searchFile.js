import formidable from "formidable";

export async function parseMultipart(request) {
  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(request);
  return { fields, files: files ?? null };
}
