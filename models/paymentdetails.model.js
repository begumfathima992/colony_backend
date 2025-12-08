import { Model, DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

class PaymentDetail extends Model {}

PaymentDetail.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvvNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extraDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PaymentDetail",
    tableName: "paymentdetails",
    timestamps: true,
  }
);

export default PaymentDetail;
