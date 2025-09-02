// import { config } from 'dotenv'

// config()
// export const environmentVar = {
//     PORT: process.env.PORT,
//     DB_NAME: process.env.DB_NAME,
//     DB_USERNAME: process.env.DB_USERNAME,
//     DB_PASSWORD: process.env.DB_PASSWORD,
//     DB_HOST: process.env.DB_HOST,
//     DB_PORT: process.env.DB_PORT,
//     SECRET_VALUE: process.env.SECRET_VALUE,
// }



import { config } from 'dotenv'
config()
const env= {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  PORT:process.env.PORT
};
 export default env

