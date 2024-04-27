const { types } = require('pg');
const { builtins } = require('pg-types');
const moment = require('moment');
require('dotenv').config();

/**
 * Handle Date FORMAT RETURNED FROM DATABASE
 *
 * @param {*} val
 * @returns
 */
const parseFn = (val) => {
  return val === null ? null : moment(val).format('YYYY-MM-DD');
};

types.setTypeParser(builtins.TIMESTAMPTZ, parseFn);
types.setTypeParser(builtins.TIMESTAMP, parseFn);

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', // Enter your MySQL password here
      database: 'hackshub', // Replace 'your_database_name' with your MySQL database name
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    pool: {
      min: 2,
      max: 50,
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', // Enter your MySQL password here
      database: 'hackshub', // Replace 'your_test_database_name' with your MySQL test database name
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    useNullAsDefault: true,
  },
  staging: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', // Enter your MySQL password here
      database: 'hackshub', // Replace 'your_staging_database_name' with your MySQL staging database name
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '', // Enter your MySQL password here
      database: 'hackshub', // Replace 'your_production_database_name' with your MySQL production database name
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
    useNullAsDefault: true,
  },
};