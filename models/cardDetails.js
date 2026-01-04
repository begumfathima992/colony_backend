import { Sequelize, DataTypes } from 'sequelize'
import dbconnection from '../config/dbconfig.js'

const cardDetailModel = dbconnection.define(
    'cardDetail', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cardNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cardExpiry: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CVV: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    extraDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stripePaymentMethodId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false, tableName: 'cardDetail' }
)
export default cardDetailModel