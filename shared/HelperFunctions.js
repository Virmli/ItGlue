class HelperFunctions {
  static getNumberOfPaymentsAndInterestRate(amortizationPeriod, mortgageInterestRate, paymentSchedule) {
    let numberOfPayments = 0;
    let interestRate = 0;
    if(paymentSchedule === 'weekly') {
      numberOfPayments = amortizationPeriod * 52;
      interestRate = mortgageInterestRate / 52;
    }

    if(paymentSchedule === 'biweekly') {
      numberOfPayments = amortizationPeriod * 26;
      interestRate = mortgageInterestRate / 26;
    }

    if(paymentSchedule === 'monthly') {
      numberOfPayments = amortizationPeriod * 12;
      interestRate = mortgageInterestRate / 12;
    }

    return {
      numberOfPayments,
      interestRate
    }
  }
}

module.exports = HelperFunctions;