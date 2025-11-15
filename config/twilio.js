import twilio from "twilio";
import env from "./environmentVariables.js"; 


const clientTwilio = twilio(
 env.TWILIO_ACCOUNT_SID,
env.TWILIO_AUTH_TOKEN
);

export default clientTwilio;