import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Reservation extends Model { }

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
      // field: 'party_size', // maps model property to DB column
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ✅ All dropdown-related data in one JSONB column
    extraOptions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    // ✅ Cancellation policy details
    cancellationPolicy: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    cancellationPolicyAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reservationId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    userDietaryByParty: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userDietary: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userOccasion: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userNotes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
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
