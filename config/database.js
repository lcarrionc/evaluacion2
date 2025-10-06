require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Para Render u otros servicios que dan DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Render no usa certificados válidos por defecto
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'examen2',
    process.env.DB_USER || 'dbexamen2_user',
    process.env.DB_PASS || 't4nLIIXM1sNxv2WlFYLZtZRYNva3uoTt',
    {
      host: process.env.DB_HOST || 'dpg-d3i213e3jp1c73fv31fg-a.oregon-postgres.render.com',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );
}

module.exports = sequelize;
