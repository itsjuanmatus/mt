module.exports = (sequelize, Sequelize) => {
  const tenants = sequelize.define(
    'tenants',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      slug: {
        type: Sequelize.STRING
      },
      db_name: {
        type: Sequelize.STRING
      },
      db_host: {
        type: Sequelize.STRING
      },
      db_username: {
        type: Sequelize.STRING
      },
      db_password: {
        type: Sequelize.STRING
      },
      db_port: {
        type: Sequelize.STRING
      }
    },
    {
      timestamps: false
    }
  )
  return tenants
}
