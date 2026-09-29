import formidable from "formidable";
import fs from "fs";
import os from "os";
export async function parseMultipart(request, folder) {
  folder = process.env.TEMP_DIR ?? os.tmpdir();
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const form = formidable({ multiples: false, uploadDir: folder });

  const [fields, files] = await form.parse(request);
  return { fields, files: files ?? null };
}
