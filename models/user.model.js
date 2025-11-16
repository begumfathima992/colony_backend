import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class User extends Model { }

User.init(
  {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    anniversary_date: DataTypes.STRING,
    birthday_date: DataTypes.STRING,
    membership_number: DataTypes.STRING,
    access_token: DataTypes.TEXT,
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_phone_verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
