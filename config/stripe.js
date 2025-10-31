import Stripe from 'stripe';
import env from "./environmentVariables.js"; 
const stripe = new Stripe(env.STRIPE_SECRET_KEY); // your secret key

export default stripe;