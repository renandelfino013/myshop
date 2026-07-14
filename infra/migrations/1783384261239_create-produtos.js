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
  pgm.createTable("produtos", {
    id: "id",
    image: { type: "VARCHAR(500)" },
    nome: { type: "VARCHAR (255)", notNull: true },
    preco: { type: "NUMERIC (10,2)", notNull: true },
    estoque: { type: "INTEGER", notNull: true },
    categoria_id: {
      type: "INTEGER",
      references: '"categorias"',
      onDelete: "SET NULL",
    },
  });
};
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("produtos");
};
