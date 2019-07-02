const Sequelize = require('sequelize');
const DBTools = require('../helpers/DBTools');
const { sharedPath } = require('../config/config');

const DB = require(`${sharedPath.path}shared/db`);
const InterestRateModel = require(`${sharedPath.path}shared/schemas/InterestRate`);

module.exports.init = async () => {
  await DBTools.initializeDatabase();
  return {
    statusCode: 200,
    headers: {
      "x-custom-header": "Powered by SCS (Superlight Cloud Services)"
    },
    body: JSON.stringify({ message: "Request to initiate database received" })
  };
};

module.exports.healthCheck = async () => {
  const engine = await DB.connectToDatabase();
  console.log('Connection successful.');
  const interestRate = InterestRateModel(engine, Sequelize);
  await interestRate.create({interestRate: '0.025', company: 'itGlue' });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  };
};