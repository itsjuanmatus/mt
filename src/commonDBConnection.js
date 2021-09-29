const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      freezeTableName: true
    },
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 1000000
    }
  }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db

db.tenants = require('./models/tenants.model.js')(sequelize, Sequelize)

/* import knex from 'knex';

const knexConfig = {
  client: process.env.DB_CLIENT,
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
  },
  pool: { min: 2, max: 20 }
};

export default knex(knexConfig);
 */
