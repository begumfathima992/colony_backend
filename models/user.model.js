import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class User extends Model { }

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    anniversary_date: DataTypes.STRING,
    birthday_date: DataTypes.STRING,
    membership_number: DataTypes.STRING,
    access_token: DataTypes.TEXT,
    // otp: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_phone_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'customer',
    },
    staff_login_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
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

  },

  
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
