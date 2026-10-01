import { validateSearchSchema } from "schemas/search/search.schemas";
import {
  validateGetAdminSchema,
  validateIdforusersSchema,
} from "schemas/users/users.schema";
import {
  getAllUsersAdmin,
  GetSearchUsers,
  getUserbyidAdmin,
  softRemoveUserAdmin,
} from "services/auth/users/users-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import { offsetAndPageProccess } from "utils/helper/search/offsetAndPageProccess";
import responseAbstration from "utils/response/responseAbstration";
import resposeAbstration from "utils/response/responseAbstration";
import validationtoken from "utils/validators/validationtoken";

export async function handler(req) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  const session_version = req.headers["x-user-session_version"];
  await validationtoken(email, session_version);
  if (req.method === "GET" && !req.query.id && !req.query.search) {
    let { page, limit } = req.query;
    let data;
    if (limit !== undefined && page !== undefined) {
      data = validateGetAdminSchema({ limit, page });
      page = data.page;
      limit = data.limit;
    }

    return resposeAbstration(
      200,
      "users found",
      await getAllUsersAdmin(limit, page, role),
    );
  } else if (req.method === "GET" && req.query.search) {
    const { search, page, limit } = req.query;
    const processed = offsetAndPageProccess(page, limit);
    const data = validateSearchSchema({ search });

    return responseAbstration(
      200,
      "users found",
      await GetSearchUsers(
        data.search,
        processed.limit,
        processed.offset,
        role,
      ),
    );
  } else if (req.method === "GET" && req.query.id) {
    const { id } = req.query;
    const data = validateIdforusersSchema({ id });
    const myuser = await getUserbyidAdmin(data.id, role);

    return responseAbstration(200, "user found", myuser);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const data = validateIdforusersSchema({ id });
    await softRemoveUserAdmin(data.id, role);
    return responseAbstration(200, "user removed");
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
