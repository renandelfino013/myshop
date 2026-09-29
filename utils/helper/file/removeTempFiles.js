import fs from "fs/promises";
export async function removeTempfile(filepath) {
  await fs.unlink(filepath).catch(() => {});
}
