/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('pedidos', {
    id: 'id',
    usuarios_id: { type: 'integer', notNull: true },
    data_pedido: { type: 'timestamp', default: pgm.func('current_timestamp') },
    status: { type: 'varchar(50)', notNull: true },
  })

  pgm.addConstraint('pedidos', 'fk_pedidos_usuario', {
    foreignKeys: {
      columns: 'usuarios_id',
      references: 'usuarios(id)',
      onDelete: 'CASCADE',
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('pedidos')
}
