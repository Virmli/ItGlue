const Sequelize = require('sequelize');
const { dbSettings } = require('./config/config');

class DB {
  static async connectToDatabase() {
    const engine = new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password, {
      host: dbSettings.host,
      port: dbSettings.port,
      dialect: 'postgres',
      dialectOptions: {
        multipleStatements: true
      }
    });

    await engine.sync();
    await engine.authenticate();

    return engine;
  }
}


module.exports = DB;
