import { Sequelize, DataTypes } from 'sequelize'
import dbconnection from '../config/dbconfig.js'

const faqCategoryModel = dbconnection.define(
    'faqCategory', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true },
    name: { type: DataTypes.STRING, required: true },

    description: { type: DataTypes.STRING, required: false, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false, tableName: 'faqCategory' }
)
export default faqCategoryModel