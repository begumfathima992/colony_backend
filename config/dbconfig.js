// import { config } from 'dotenv'
// import { Sequelize } from 'sequelize'

// config()
// const dbconnection = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USERNAME,
//     process.env.DB_PASSWORD, {

//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialectOptions: {
//         timezone: "local",
//     },
//     // timezone: "+00:00",
//     // timezone: "Z",
//     dialect: 'mysql',
//     define: {
//         timestamps: true
//     },
//     pool: {
//         max: 15,
//         min: 0,
//         maxIdleTime: 1000,
//         acquire: 30000000,
//         idle: 100000000
//     },
//     logging: false
// }

// )
// export default dbconnection


// const { Sequelize } = require("sequelize");
// const env = require("./environmentVariables");

// const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
//   host: env.DB_HOST,
//   dialect: env.DB_DIALECT,
//   logging: false,
// });

// module.exports = sequelize;
import { Sequelize } from "sequelize";
import environmentVar from "./environmentVariables.js";

const dbconnection = new Sequelize(environmentVar.DB_NAME, environmentVar.DB_USER, environmentVar.DB_PASSWORD, {
  host: environmentVar.DB_HOST,
  dialect: environmentVar.DB_DIALECT,
  logging: false,
});

export default dbconnection;