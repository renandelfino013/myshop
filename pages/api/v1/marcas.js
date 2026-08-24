import dotenv from "dotenv";
import {
  getbrandbyid,
  getbrandbyname,
  getallbrands,
  renameBrand,
  createbrand,
  removebrand,
} from "services/brand/brand-services";
import validationtoken from "services/auth/validationtoken";
dotenv.config();
export default async function handler(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const role = req.headers["x-user-role"];
    await validationtoken(userId, email, role);

    if (req.method === "GET" && !req.query.id && !req.query.nome) {
      const getbrands = await getallbrands();
      res.status(200).json(getbrands);
    } else if (req.method === "GET" && req.query.id) {
      const { id } = req.query;
      const brand = await getbrandbyid(id);
      res.status(200).json(brand);
    } else if (req.method === "GET" && req.query.nome) {
      const { nome } = req.query;
      const brand = await getbrandbyname(nome);
      res.status(200).json(brand);
    } else if (req.method === "POST") {
      await createbrand(req.body.nome, role);
      res
        .status(201)
        .json({ success: true, message: "Brand sucessfully created" });
    } else if (req.method == "PATCH") {
      const { brandname, newname } = req.body;
      await renameBrand(brandname, newname, role);
      res
        .status(200)
        .json({ success: true, message: "Brand sucessfully updated" });
    } else if (req.method === "DELETE") {
      const { name } = req.body;
      await removebrand(name, role);
      res
        .status(200)
        .json({ success: true, message: "Brand sucessfully deleted" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res
      .status(error.status || error.statusCode || 500)
      .json({ error: error.message });
  }
}
