import pool from 'utils/db.js'

export async function dbversion() {
  try {
    const dbv = await pool.query('SHOW server_version;')

    return dbv.rows[0].server_version
  } catch (error) {
    console.error('Erro ao consultar versão do banco:', error)
    throw error
  }
}
export async function dbmaxconec() {
  const maxconec = await pool.query('SHOW max_connections;')

  return maxconec.rows[0].max_connections
}
export async function dbsActivec() {
  const activec = await pool.query(
    'SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1;',
    [process.env.POSTGRES_DB]
  )
  return activec.rows[0].count
}
