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
  pgm.createTable('usuarios', {
    id: 'id',
    nome: { type: 'VARCHAR (255)', notNull: true },
    email: { type: 'VARCHAR (255)', unique: true, notNull: true },
    senha: { type: 'VARCHAR (255)', notNull: true },
    role: { type: 'VARCHAR (50)', notNull: true, default: 'user' },
    session_version: {
      type: 'INTEGER',
      notNull: true,
      default: 0,
    },
  })
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('users')
}
