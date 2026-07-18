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
  pgm.createTable("password_reset_keys", {
    id: "id",
    expirado: { type: "boolean", default: false },
    usuariosid: { type: "integer", notNull: true },
    key: { type: "varchar(255)", notNull: true },
  });

  pgm.addConstraint("password_reset_keys", "fk_password_reset_usuario", {
    foreignKeys: {
      columns: "usuariosid",
      references: "usuarios(id)",
      onDelete: "CASCADE",
    },
  });
};
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("password_reset_keys");
};
