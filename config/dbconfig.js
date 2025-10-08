import { Sequelize } from "sequelize";
import env from "./environmentVariables.js"; // make sure this is also an ES module

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST || "127.0.0.1",
  dialect: env.DB_DIALECT || "postgres",
  logging: false,
});

export default sequelize;
