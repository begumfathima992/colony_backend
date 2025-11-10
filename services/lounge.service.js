import Lounge from "../models/lounge.js";

import stripe, { stripeWebhookSecret } from '../config/stripe.js'
import env from "../config/environmentVariables.js";
class LoungeService {
  async createLounge(data) {
    // console.log(data,"datttttt")
    return await Reservation.create(data);

  }}
  const loungeServiceObj = new LoungeService();
export default loungeServiceObj;