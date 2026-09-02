import {
  validateidForOrders,
  validateidForOrdersUser,
  validateorderDelete,
  validateorderPost,
} from "schemas/orders/orders.schemas";
import validationtoken from "services/auth/validationtoken";
import {
  Get_All_orders_Admin,
  Get_All_Orders_Of_User,
  Get_order_per_Id,
  Get_order_per_id_admin,
  PostOrder,
  Removeorder,
  RemoveorderAdmin,
} from "services/orders/order-services";
export default async function handler(req, res) {
  try {
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
      res.status(200).json(orders);
    } else if (req.method === "GET" && Object.keys(req.query).length === 0) {
      const orders = await Get_All_Orders_Of_User(userId);
      res.status(200).json(orders);
    } else if (req.method === "GET" && req.query.order_id && role === "ADMIN") {
      const { order_id } = req.query;
      const data = validateidForOrders({ id: order_id });
      const order = await Get_order_per_id_admin(data.id, role);
      res.status(200).json(order);
    } else if (req.method === "GET" && req.query.order_id) {
      const { order_id } = req.query;
      const data = validateidForOrdersUser({ id: order_id, user_id: userId });
      const order = await Get_order_per_Id(data.user_id, data.id);
      res.status(200).json(order);
    } else if (req.method === "POST") {
      const { items } = req.body;
      const data = validateorderPost({ userId, items });
      const order_id = await PostOrder(data.userId, data.items);
      res.status(201).json({
        success: true,
        message: "Order created successfully!",
        order_id: order_id,
      });
    } else if (req.method === `DELETE` && role === `ADMIN`) {
      const { order_id } = req.query;
      const data = validateorderDelete({ orderId: order_id });
      const orderId = data.orderId;

      await RemoveorderAdmin(orderId, role);
      res
        .status(200)
        .json({ success: true, message: "order deleted successfully!" });
    } else if (req.method === "DELETE") {
      const { order_id } = req.query;
      const data = validateorderDelete({ orderId: order_id });
      const orderId = data.orderId;

      await Removeorder(userId, orderId);
      res
        .status(200)
        .json({ success: true, message: "order deleted successfully!" });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in orders API:", error);
    res
      .status(error.status || error.statusCode || 500)
      .json({ error: error.message });
  }
}
