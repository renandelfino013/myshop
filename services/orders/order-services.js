import {
  DeleteOrder,
  DeleteorderAdmin,
  FindAllOrders,
  FindAllOrdersAdmin,
  FindOrderPerId,
  FindOrderPerIdAdmin,
  Insertorder,
} from "models/orders/model-orders";
import assertFound from "utils/helper/assertFound";
import verifyuserRole from "utils/validators/verifyuserRole";

export async function Get_All_Orders_Of_User(user_id) {
  const orders = await FindAllOrders(user_id);
  return orders;
}
export async function Get_All_orders_Admin(role) {
  const context = "view";
  await verifyuserRole(role, context);
  const allOrders = await FindAllOrdersAdmin();
  const message = "orders";
  await assertFound(allOrders, message);
  return allOrders;
}
export async function Get_order_per_id_admin(order_id, role) {
  await verifyuserRole(role, "view");
  const order = await FindOrderPerIdAdmin(order_id);
  assertFound(order, "order");
  return order;
}
export async function Get_order_per_Id(user_id, order_id) {
  const order = await FindOrderPerId(order_id, user_id);

  const context = "order";
  assertFound(order, context);
  return order;
}
export async function PostOrder(user_id, items) {
  return Insertorder(user_id, items);
}

export async function Removeorder(user_id, order_id) {
  const deleted = await DeleteOrder(user_id, order_id);
  const message = "order";
  await assertFound(deleted, message);
}
export async function RemoveorderAdmin(order_id, role) {
  await verifyuserRole(role, "delete a order of another user");
  const order = await DeleteorderAdmin(order_id);
  assertFound(order, "order");
  return order;
}
