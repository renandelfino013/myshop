import { dbversion, dbmaxconec, dbsActivec } from "models/status/status";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const updated_at = new Date().toISOString();
    const versaodb = await dbversion();
    const maxconec = await dbmaxconec();
    const activec = await dbsActivec();
    res.status(200).json({
      status: "API is running",
      updated_at: updated_at,
      dependencies: {
        database: versaodb,
        max_connections: maxconec,
        active_connections: Number(activec),
      },
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
