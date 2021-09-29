import knex from 'knex'
/* import commonDBConnection from './commonDBConnection'
 */
import { getNamespace } from 'continuation-local-storage'

const db = require('./commonDBConnection')
const commonDBConnection = db.tenants

const Sequelize = require('sequelize')

let connectionMap

/**
 *  Create knex instance for all the tenants
 * defined in common database and store in a map.
 **/

export async function connectAllDb () {
  let tenants

  try {
    tenants = await commonDBConnection.findAll()
  } catch (e) {
    console.log('error', e)
    return
  }

  connectionMap = tenants
    .map(tenant => {
      return {
        [tenant.slug]: createConnectionConfig(tenant)
      }
    })
    .reduce((prev, next) => {
      return Object.assign({}, prev, next)
    }, {})
}

/**
 *  Create configuration object for the given tenant.
 **/

/* function createConnectionConfig (tenant) {
  return {
    client: process.env.DB_CLIENT,
    connection: {
      host: tenant.db_host,
      port: tenant.db_port,
      user: tenant.db_username,
      database: tenant.db_name,
      password: tenant.db_password
    },
    pool: { min: 2, max: 20 }
  }
} */
function createConnectionConfig (tenant) {
  return new Sequelize(tenant.db_name, tenant.db_username, tenant.db_password, {
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
  })
}

/**
 * Get the connection information (knex instance)
 * for the given tenant's slug.
 */

export function getConnectionBySlug (slug) {
  if (connectionMap) {
    console.log(`Getting connection for ${slug}`)

    return connectionMap[slug]
  }
}

/**
 * Get the connection information (knex instance)
 * for current context. Here we have used a
 * getNamespace from 'continuation-local-storage'.
 * This will let us get / set any
 * information and binds the information
 * to current request context.
 */

export function getConnection () {
  const nameSpace = getNamespace('unique context')
  const conn = nameSpace.get('connection')

  if (!conn) {
    throw 'Connection is not set for any tenant database.'
  }

  return conn
}
