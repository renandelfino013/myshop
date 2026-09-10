import dotenv from "dotenv";
import {
  getbrandbyid,
  getbrandbyname,
  getallbrands,
  renameBrand,
  createbrand,
  removebrand,
} from "services/brand/brand-services";
import validationtoken from "utils/validators/validationtoken";
import {
  validateSchemaDeleteBrand,
  validateSchemaGetperIdBrand,
  validateSchemaGetperNameBrand,
  validateSchemaPostBrand,
  validateSchemaPutBrand,
} from "schemas/brands/brand.schema";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { methodNotAllowedError } from "utils/errors/error";
import responseAbstration from "utils/response/responseAbstration";
dotenv.config();
export async function handler(req) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  const session_version = req.headers["x-user-session_version"];
  await validationtoken(email, session_version);

  if (req.method === "GET" && !req.query.id && !req.query.nome) {
    const getbrands = await getallbrands();
    return responseAbstration(200, "Brands retrieved successfully", getbrands);
  } else if (req.method === "GET" && req.query.id) {
    const { id } = req.query;
    const data = validateSchemaGetperIdBrand({ id });
    const brand = await getbrandbyid(data.id);
    return responseAbstration(200, "Brand retrieved successfully", brand);
  } else if (req.method === "GET" && req.query.nome) {
    const { nome } = req.query;
    const data = validateSchemaGetperNameBrand({ nome });
    const brand = await getbrandbyname(data.nome);
    return responseAbstration(200, "Brand retrieved successfully", brand);
  } else if (req.method === "POST") {
    const data = validateSchemaPostBrand({ nome: req.body.nome });
    await createbrand(data.nome, role);
    return responseAbstration(201, "Brand sucessfully created");
  } else if (req.method == "PATCH") {
    const { brandname, newname } = req.body;
    const data = validateSchemaPutBrand({ brandname, newname });
    await renameBrand(data.brandname, data.newname, role);
    return responseAbstration(200, "brand successfully updated");
  } else if (req.method === "DELETE") {
    const { name } = req.body;
    const data = validateSchemaDeleteBrand({ name });
    await removebrand(data.name, role);
    return responseAbstration(200, `brand successfully deleted`);
  } else {
    throw new methodNotAllowedError([
      {
        field: "method",
        message: "Method not allowed",
      },
    ]);
  }
}

export default withErrorHandler(handler);
