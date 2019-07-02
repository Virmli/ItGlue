// connect to local DB if running offline
const dbSettings = process.env.IS_OFFLINE ?
{
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ItGlue',
  port: 5432
} :
{
  host: `${process.env.RDS_DB_HOST}`,
  user: `${process.env.RDS_DB_USER}`,
  password: `${process.env.RDS_DB_PASSWORD}`,
  database: `${process.env.RDS_DB_NAME}`,
  port: `${process.env.RDS_DB_PORT}`
};

module.exports = {
  dbSettings
};