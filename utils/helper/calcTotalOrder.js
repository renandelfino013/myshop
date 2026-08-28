export default function calcTotalOrder(items) {
  return items.reduce(
    (total, item) => total + Number(item.preco) * item.quantidade,
    0,
  );
}
