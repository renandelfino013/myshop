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
    usuario_id: { type: 'integer', notNull: true },
    data_pedido: { type: 'timestamp', default: pgm.func('current_timestamp') },
    total: { type: 'NUMERIC (10,2)', notNull: false },
  })

  pgm.addConstraint('pedidos', 'fk_pedidos_usuario', {
    foreignKeys: {
      columns: 'usuario_id',
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
