import { Sequelize, DataTypes } from 'sequelize'
import dbconnection from '../config/dbconfig.js'


const userModel = dbconnection.define(
    'user', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true },
    name: { type: DataTypes.STRING, required: true },
    email: { type: DataTypes.STRING, required: true },
    phone: { type: DataTypes.STRING, required: false },
    password: { type: DataTypes.STRING, required: true },

    anniversary_date: { type: DataTypes.STRING, required: false, allowNull: true },
    birthday_date: { type: DataTypes.STRING, required: true, allowNull: true },

    membership_number: { type: DataTypes.STRING, required: true },
    access_token: { type: DataTypes.STRING, required: false, allowNull: true },
    // user_type: { type: DataTypes.ENUM("RETAILER", "VENDOR"), defaultValue: "RETAILER" },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    title: { type: DataTypes.STRING, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true },
    nationality: { type: DataTypes.STRING, allowNull: true },
    workNumber: { type: DataTypes.STRING, allowNull: true },

    homeNumber: { type: DataTypes.STRING, allowNull: true },
    addressLineOne: { type: DataTypes.STRING, allowNull: true },
    addressLinetwo: { type: DataTypes.STRING, allowNull: true },
    addressLinethree: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false, tableName: 'user' }
)

export default userModel