import { Sequelize } from 'sequelize';
import { db } from './env.js'; // Donde importas las variables definidas en .env

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port || 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
