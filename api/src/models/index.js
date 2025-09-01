import 'dotenv/config';
import { Sequelize } from 'sequelize';

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_NAME = 'telemax',
  DB_USER = 'telemax',
  DB_PASS = ''
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 0, idle: 10000 }
});

export async function initDb() {
  await sequelize.authenticate();
  return sequelize;
}

export default sequelize;
