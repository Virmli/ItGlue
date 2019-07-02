module.exports = function (sequelize, DataTypes) {
  const tableAttributes = {
    interestRate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    }
  };

  const InterestRate = sequelize.define('interestRate', tableAttributes);

  InterestRate.associate = function (models) {
  };

  return InterestRate;
};
