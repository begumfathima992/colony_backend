import Stripe from 'stripe';
import env from "./environmentVariables.js"; 

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// export only the raw secret string for webhooks
export const stripeWebhookSecret = env.WEBHOOK_SIGNING_SECRET;

export default stripe;