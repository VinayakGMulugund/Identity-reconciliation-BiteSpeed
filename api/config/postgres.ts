import pg from 'pg'
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

const sequel = new Sequelize(
  process.env.DB_URL!,
  {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialectModule: pg
  }
);

export { sequel };
