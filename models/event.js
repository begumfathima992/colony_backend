import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class EventModel extends Model { }

EventModel.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    , mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'Event',
    timestamps: true,
  }
);

export default EventModel;
