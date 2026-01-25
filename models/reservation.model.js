import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Reservation extends Model { }

Reservation.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true },

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
      allowNull: true,
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
  stripeCustomers: {
  type: DataTypes.JSON,   // ARRAY
  allowNull: true,
  defaultValue: [],
},

stripePaymentMethods: {
  type: DataTypes.JSON,   // ARRAY
  allowNull: true,
  defaultValue: [],
},
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED'),
      defaultValue: 'PENDING',
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ephemeralKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isAcceptCancellation: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    reservationCancel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cardDetailId: {
      type: DataTypes.STRING,
      allowNull: true
    },
 // models/Reservation.js

// 1. Single active card for this specific booking
stripePaymentMethodId: {
  type: DataTypes.STRING,
  allowNull: true,
},
stripeCustomerId: {
  type: DataTypes.STRING,
  allowNull: true,
},

// 2. The list of ALL cards available for this reservation
stripePaymentMethods: {
  type: DataTypes.JSONB, 
  allowNull: true,
  defaultValue: [], // Start with an empty list
},
stripeCustomers: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: [],
}

  },
  {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true,
  }
);

export default Reservation;
