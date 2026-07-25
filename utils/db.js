import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProd
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
        host: "localhost",
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10) || 5433,
        ssl: false,
      },
);

export default pool;
