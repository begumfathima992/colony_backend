import { Sequelize, DataTypes } from 'sequelize'
import dbconnection from '../config/dbconfig.js'

const faqQuestionAnswerModel = dbconnection.define(
    'faqQuestionAnswer', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, unique: true },
    category_id: { type: DataTypes.BIGINT, required: true },
    question: { type: DataTypes.STRING, required: true },
    answer: { type: DataTypes.STRING, required: true },

    order_no: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: false, tableName: 'faqQuestionAnswer' }
)
export default faqQuestionAnswerModel