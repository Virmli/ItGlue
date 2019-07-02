const Sequelize = require('sequelize');
const { sharedPath } = require('../config/config');

const DB = require(`${sharedPath.path}shared/db`);
const HelperFunctions = require(`${sharedPath.path}shared/HelperFunctions`);

const ErrorHandler = require(`${sharedPath.path}shared/ErrorHandler`);
const InterestRateModel = require(`${sharedPath.path}shared/schemas/InterestRate`);

const minAmortization = 5;
const maxAmortization = 25;
const paymentScheduleEnum = ['weekly', 'biweekly', 'monthly'];
const maxInsurableMortgage = 1000000;

const getInsurance = (askingPrice, downPayment) => {
  const ration = downPayment / askingPrice;
  if(ration < 0.1) {
    return 3.15;
  } else if(ration < 0.15) {
    return 2.4;
  } else if(ration < 20) {
    return 1.8;
  } else {
    return 0;
  }
}

module.exports.getPaymentAmount = async (event) => {
  try {
    const {
      askingPrice,
      downPayment,
      paymentSchedule,
      amortizationPeriod
    } = event.queryStringParameters;

    if(amortizationPeriod < minAmortization || amortizationPeriod > maxAmortization) {
      return ErrorHandler.createErrorResponse(404, 'Wrong Amortization Period');
    }

    if(!paymentScheduleEnum.includes(paymentSchedule)) {
      return ErrorHandler.createErrorResponse(404, 'Wrong Payment Schedule value');
    }

    const insurance = getInsurance(askingPrice, downPayment);
    let loan = askingPrice - downPayment;

    if(insurance > 0.0) {
      if(loan > maxInsurableMortgage) {
        return ErrorHandler.createErrorResponse(404, 'Huston, we got a problem with your insurance');
      }

      loan = loan * (1 + (insurance / 100) );
    }

    const engine = await DB.connectToDatabase();
    const interestRateModel = InterestRateModel(engine, Sequelize);

    const mortgageInterestRateObject = await interestRateModel.findAll({
      where: {
        company: 'itGlue'
      }
    });

    const mortgageInterestRate = parseFloat(mortgageInterestRateObject[0].dataValues.interestRate);
    const {
      numberOfPayments,
      interestRate
    } = HelperFunctions.getNumberOfPaymentsAndInterestRate(amortizationPeriod, mortgageInterestRate, paymentSchedule);

    const numerator = interestRate * Math.pow((1 + interestRate), numberOfPayments);
    const denominator = Math.pow((1 + interestRate), numberOfPayments) - 1;
    let payment = loan * ( numerator / denominator );
    payment = Math.round(payment * 100) / 100;

    const result = {
      payments: `${paymentSchedule} Payments = ${payment} $`
    };
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return ErrorHandler.createErrorResponse(500, error.message);
  }
};

module.exports.updateInterestRate = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const interestRate = (body.interestRate * 0.01).toString();
    const engine = await DB.connectToDatabase();
    const interestRateModel = InterestRateModel(engine, Sequelize);

    const valueBefore = await interestRateModel.findAll({
      where: {
        company: 'itGlue'
      }
    });
    let result = `Interest rate changed from ${parseFloat(valueBefore[0].dataValues.interestRate * 100)} `;

    const valueAfter = await interestRateModel.update({
      interestRate: interestRate,
    }, {
      where: {
        company: 'itGlue'
      },
      returning: true,
      plain: true
    });

    result = result + `to ${parseFloat(valueAfter[1].dataValues.interestRate * 100)}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result})
    };
  } catch (error) {
    return ErrorHandler.createErrorResponse(500, error.message);
  }
};

module.exports.mortgageAmount = async (event) => {
  try {
    const {
      paymentAmount,
      downPayment,
      paymentSchedule,
      amortizationPeriod
    } = event.queryStringParameters;

    const engine = await DB.connectToDatabase();
    const interestRateModel = InterestRateModel(engine, Sequelize);

    const mortgageInterestRateObject = await interestRateModel.findAll({
      where: {
        company: 'itGlue'
      }
    });

    const mortgageInterestRate = parseFloat(mortgageInterestRateObject[0].dataValues.interestRate);
    const {
      numberOfPayments,
      interestRate
    } = HelperFunctions.getNumberOfPaymentsAndInterestRate(amortizationPeriod, mortgageInterestRate, paymentSchedule);

    let result = paymentAmount * numberOfPayments * interestRate;
    if(downPayment) {
      result = result + downPayment;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Woops, our formula is inaccurate, but its honest work! : ${result}`})
    };
  } catch (error) {
    return ErrorHandler.createErrorResponse(500, error.message);
  }
};