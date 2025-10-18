import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Reservation extends Model {}

Reservation.init(
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partySize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
   status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'), // ENUM must match DB
      defaultValue: 'PENDING',
    },
  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
  }
);

export default Reservation;
