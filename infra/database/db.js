import { Pool } from 'pg'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
const isProd = process.env.NODE_ENV === 'production'

const config = isProd
  ? {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.POSTGRES_USER,
      host: 'localhost',
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10) || 5433,
      ssl: false,
    }
try {
  dotenvExpand.expand(dotenv.config())
} catch (err) {
  console.warn('Nenhum .env encontrado, usando variáveis do ambiente', err)
}

const pool = globalThis.pgPool ?? new Pool(config)
if (!isProd) globalThis.pgPool = pool

export default pool
