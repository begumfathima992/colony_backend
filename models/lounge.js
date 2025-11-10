import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Lounge extends Model {}

Lounge.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    l_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    l_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    l_partysize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    l_paymentintentid: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    loungeid: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    l_customerid: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    l_paymethodid: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    l_clientsercret: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Stripe client secret (typo kept intentionally to match API schema)',
    },

    l_emeralkey: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ephemeral key for Stripe',
    },

    l_cancellationpolicy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    l_cancellationaccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Lounge',
    tableName: 'lounges', // pluralized name (change to 'lounge' if you prefer singular)
    timestamps: true,
  }
);

export default Lounge;
