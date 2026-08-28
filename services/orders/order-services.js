import {
  DeleteOrder,
  DeleteorderAdmin,
  FindAllOrders,
  FindAllOrdersAdmin,
  FindOrderPerId,
  FindOrderPerIdAdmin,
  Insertorder,
} from "models/orders/model-orders";
import { ValidationError } from "utils/errors/error";
import assertFound from "utils/helper/assertFound";
import regexid from "utils/Regex/regexId";
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
  regexid(order_id);
  const order = await FindOrderPerIdAdmin(order_id);
  assertFound(order, "order");
  return order;
}
export async function Get_order_per_Id(user_id, order_id) {
  regexid(order_id);
  regexid(user_id);
  const order = await FindOrderPerId(order_id, user_id);

  const context = "order";
  assertFound(order, context);
  return order;
}
export async function PostOrder(user_id, items) {
  const normalizedItems = validateOrderItems(items);
  return Insertorder(user_id, normalizedItems);
}
function validateOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError("Order must have at least one item");
  }

  const normalizedItems = items.map((item) => {
    if (!item || item.produto_id === undefined) {
      throw new ValidationError("Invalid produto_id");
    }

    const produtoId = Number(item.produto_id);

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      throw new ValidationError("Invalid produto_id");
    }

    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new ValidationError("quantidade must be a positive integer");
    }

    return {
      ...item,
      produto_id: produtoId,
      quantidade: Number(item.quantidade),
    };
  });

  const ids = normalizedItems.map((item) => item.produto_id);

  if (new Set(ids).size !== ids.length) {
    throw new ValidationError("Duplicate produto_id in the same order");
  }

  return normalizedItems;
}
export async function Removeorder(user_id, order_id) {
  await regexid(order_id);
  const deleted = await DeleteOrder(user_id, order_id);
  const message = "order";
  await assertFound(deleted, message);
}
export async function RemoveorderAdmin(order_id, role) {
  await verifyuserRole(role, "delete a order of another user");
  await regexid(order_id);
  const order = await DeleteorderAdmin(order_id);
  assertFound(order, "order");
  return order;
}
