import {
  validateidForOrders,
  validateidForOrdersUser,
  validateorderDelete,
  validateorderPost,
} from "schemas/orders/orders.schemas";
import validationtoken from "utils/validators/validationtoken";
import {
  Get_All_orders_Admin,
  Get_All_Orders_Of_User,
  Get_order_per_Id,
  Get_order_per_id_admin,
  PostOrder,
  Removeorder,
  RemoveorderAdmin,
} from "services/orders/order-services";
import { methodNotAllowedError } from "utils/errors/error";
import { withErrorHandler } from "utils/errors/withErrorHandler";
import resposeAbstration from "utils/response/responseAbstration";
import responseAbstration from "utils/response/responseAbstration";
export async function handler(req) {
  const userId = req.headers["x-user-id"];
  const email = req.headers["x-user-email"];
  const role = req.headers["x-user-role"];
  await validationtoken(userId, email, role);
  if (
    req.method === "GET" &&
    Object.keys(req.query).length === 0 &&
    role === "ADMIN"
  ) {
    const orders = await Get_All_orders_Admin(role);
    return responseAbstration(200, "orders found", orders);
  } else if (req.method === "GET" && Object.keys(req.query).length === 0) {
    const orders = await Get_All_Orders_Of_User(userId);
    return responseAbstration(200, "orders found", orders);
  } else if (req.method === "GET" && req.query.order_id && role === "ADMIN") {
    const { order_id } = req.query;
    const data = validateidForOrders({ id: order_id });
    const order = await Get_order_per_id_admin(data.id, role);
    return responseAbstration(200, "order found", order);
  } else if (req.method === "GET" && req.query.order_id) {
    const { order_id } = req.query;
    const data = validateidForOrdersUser({ id: order_id, user_id: userId });
    const order = await Get_order_per_Id(data.user_id, data.id);
    return responseAbstration(200, "order found", order);
  } else if (req.method === "POST") {
    const { items } = req.body;
    const data = validateorderPost({ userId, items });
    const order_id = await PostOrder(data.userId, data.items);
    return responseAbstration(201, "Order created successfully!", [
      { order_id },
    ]);
  } else if (req.method === `DELETE` && role === `ADMIN`) {
    const { order_id } = req.query;
    const data = validateorderDelete({ orderId: order_id });
    const orderId = data.orderId;

    await RemoveorderAdmin(orderId, role);
    return resposeAbstration(200, "order deleted successfully!");
  } else if (req.method === "DELETE") {
    const { order_id } = req.query;
    const data = validateorderDelete({ orderId: order_id });
    const orderId = data.orderId;

    await Removeorder(userId, orderId);
    return resposeAbstration(200, "order deleted successfully!");
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
