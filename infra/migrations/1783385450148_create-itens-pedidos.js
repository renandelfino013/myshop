/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("itens_pedido", {
    id: "id",
    pedido_id: { type: "integer", notNull: true },
    produto_id: { type: "integer", notNull: true },
    quantidade: { type: "integer", notNull: true },
    preco_unitario: { type: "numeric(10,2)", notNull: true },
  });

  pgm.addConstraint("itens_pedido", "fk_itens_pedido_pedido", {
    foreignKeys: {
      columns: "pedido_id",
      references: "pedidos(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("itens_pedido", "fk_itens_pedido_produto", {
    foreignKeys: {
      columns: "produto_id",
      references: "produtos(id)",
      onDelete: "RESTRICT",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("itens_pedido");
};
