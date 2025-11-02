import Reservation  from "../models/reservation.model.js";

import stripe from '../config/stripe.js'


// import { Reservation } from '../models/index.model.js'; // central models import

// class ReservationService {
//   async createReservation(data) {
//     // Create a new reservation
//     return await Reservation.create(data);
//   }

//   async getReservationsByDate(date) {
//     // Find reservations by date
//     return await Reservation.findAll({ where: { date }, order: [['time', 'ASC']] });
//   }

//   async getUserReservations(user_id) {
//     // Find reservations by user_id
//     return await Reservation.findAll({ where: { user_id }, order: [['date', 'ASC'], ['time', 'ASC']] });
//   }

//   async updateReservation(id, data) {
//     // Update reservation and return updated record
//     await Reservation.update(data, { where: { id } });
//     return await Reservation.findByPk(id);
//   }

//   async deleteReservation(id) {
//     // Delete reservation
//     return await Reservation.destroy({ where: { id } });
//   }
// }

// const reservationServiceObj = new ReservationService();
// export default reservationServiceObj;

class ReservationService {
  async createReservation(data) {
    return await Reservation.create(data);
  }

  // async getReservationsByDate(date) {
  //   return await Reservation.findAll({
  //     where: { date },
  //     order: [['time', 'ASC']],
    // });
  // }

  // async getUserReservations(user_id) {
  //   return await Reservation.findAll({
  //     where: { user_id },
  //     order: [
  //       ['date', 'ASC'],
  //       ['time', 'ASC'],
  //     ],
  //   });
  // }

  // // ✅ New method to get reservation by ID
  // async getReservationById(id) {
  //   return await Reservation.findByPk(id);
  // }

  // async updateReservation(id, data) {
  //   await Reservation.update(data, { where: { id } });
  //   return await Reservation.findByPk(id);
  // }
  //   async updatePaymentIntent(id, paymentIntentId) {
  //   await Reservation.update(
  //     { paymentIntentId },
  //     { where: { id } }
  //   );
  //   return await Reservation.findByPk(id);
  // }


  // services/reservation.services.js

// services/reservation.services.js

///////////////////////////////////

// async patentIntend(req, res) {
//   try {
//     const { amount, currency = "gbp", phone } = req.body;

//     if (!amount) {
//       return res.status(400).json({ success: false, message: "Amount is required" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // £10 → 1000 pence
//       currency,
//       metadata:{phone},
//       automatic_payment_methods: { enabled: true },
//     });

//     res.status(200).json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     console.error("Stripe Create Intent Error:", err);
//     res.status(500).json({ success: false, message: "Payment creation failed" });
//   }
// };

//////////////////////
// async patentWeb(req, res) {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("⚠️  Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "payment_intent.succeeded":
//       const successPayment = event.data.object;
//       console.log("✅ Payment succeeded:", successPayment.id);
//       // Update reservation/payment status in DB
//       break;

//     case "payment_intent.payment_failed":
//       const failedPayment = event.data.object;
//       console.log("❌ Payment failed:", failedPayment.id);
//       // Update DB with failure
//       break;

//     default:
//       console.log(`Unhandled event type: ${event.type}`);
//   }

//   res.sendStatus(200);
// }
//////////////


async  createPaymentIntent(amount, currency = "gbp", phone) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { phone },
    automatic_payment_methods: { enabled: true },
  });
}

/////////////




async  updateReservationDetails({ reservationId, extraOptions, cancellationPolicy }) {
  try {
    const existing = await Reservation.findOne({
      where: { id: reservationId },
    });

    if (!existing) throw new Error("Reservation not found");

    return await existing.update({
      extraOptions,
      cancellationPolicy,
    });
  } catch (err) {
    console.error("Error updating reservation details:", err);
    throw err;
  }
}



  async deleteReservation(id) {
    return await Reservation.destroy({ where: { id } });
  }
}

const reservationServiceObj = new ReservationService();
export default reservationServiceObj;
