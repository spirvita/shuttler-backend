module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // 開發環境可以開，正式環境請改為 false
  ssl: process.env.DB_ENABLE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
