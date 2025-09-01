import mysql from 'mysql2/promise';

const {
  DB_HOST = '209.38.231.125',
  DB_NAME = 'telemax',
  DB_USER = 'telemax',
  DB_PASS = 'Neon@2025Server!',
  DB_PORT = '3306',
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
