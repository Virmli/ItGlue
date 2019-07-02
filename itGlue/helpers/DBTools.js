const { dbSettings, sharedPath } = require('../config/config');
const Sequelize = require('sequelize');
const { Client } = require('pg');

const DB = require(`${sharedPath.path}shared/db`);

const InterestRate = require(`${sharedPath.path}shared/schemas/InterestRate`);

class DBTools {
  static async initializeDatabase() {
    try {
      const dbClient = new Client({
        user: dbSettings.user,
        host: dbSettings.host,
        database: dbSettings.database,
        password: dbSettings.password,
        port: dbSettings.port
      });
      dbClient.connect();
      try {
        await dbClient.query(`CREATE SCHEMA IF NOT EXISTS ${dbSettings.database}`);
        await DBTools.createAllTables();
        dbClient.end();
      } catch (error) {
        console.log('Create Tables error', error);
      }
    } catch (ex) {
      console.log(ex);
      console.log('Failed to connect', dbSettings);
    }
  }

  static async createAllTables() {
    // set engine
    const engine = await DB.connectToDatabase();

    const models = {
      interestRate: InterestRate(engine, Sequelize),
    };

    Object.keys(models).forEach((modelName) => {
      if ('associate' in models[modelName]) {
        models[modelName].associate(models);
      }
    });
    await engine.sync({ force: true });
  }
}


module.exports = DBTools;
