import { config } from 'dotenv'
config()
const env = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  PORT: process.env.PORT,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SID: process.env.TWILIO_VERIFY_SID,
  WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET,
  // ZIGGY_PER_PERSON_FEE: process.env.ZIGGY_PER_PERSON_FEE || 500,
  ZIGGY_PER_PERSON_FEE:process.env.ZIGGY_PER_PERSON_FEE||12,

  TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER
};
export default env
