const { DataSource } = require('typeorm');
const config = require('../config/index');

const Member = require('../entities/Member');

const dataSource = new DataSource({
  type: 'postgres',
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  synchronize: config.get('db.synchronize'),
  poolSize: 10,
  entities: [Member],
  ssl: config.get('db.ssl'),
});

module.exports = { dataSource };
