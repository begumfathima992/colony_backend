import Reservation from "../models/reservation.model.js";

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
    // console.log(data,"datttttt")
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


  // async createPaymentIntent(amount, currency = "gbp", phone) {
  //   return stripe.paymentIntents.create({
  //     amount: Math.round(amount * 100),
  //     currency,
  //     metadata: { phone },
  //     automatic_payment_methods: { enabled: true },
  //   });
  // }

  /////////////
  async createPaymentIntent(req, res) {
    try {
      const userData = req.userData
      let { customer_id, reservationId, clientSecret, ephemeralKey } = req.obj
      const findOne = await Reservation.findOne({
        where: {
          reservationId: reservationId,
          user_id: userData?.id
        }, raw: true
      })
      if (!findOne) {
        return res.status(404).json({
          status: false,
          message: "Reservation not found"
        })
      }

      let obj = {
        customer_id, clientSecret, ephemeralKey
      }
      await Reservation?.update(obj, { where: { user_id: userData?.id, reservationId } })
    } catch (err) {
      console.error(err, 'create patent error')
      return res.status(500).json({ message: err?.message, statusCode: 500, success: false })
    }
  }




  async updateReservationDetails(req, res) {
    try {
      const {
        reservationId,
        extraOptions,
        userDietaryByParty,
        userDietary,
        userOccasion,
        userNotes,
        cancellationPolicy
      } = req.body;

      const existing = await Reservation.findByPk(reservationId);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      const updated = await existing.update({
        extraOptions,
        userDietaryByParty,
        userDietary,
        userOccasion,
        userNotes,
        cancellationPolicy,
      });

      return res.status(200).json({
        success: true,
        message: "Reservation updated successfully",
        data: updated,
      });
    } catch (err) {
      console.error("Error updating reservation:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  // =====================================================
  // 1️⃣ Create SetupIntent — user enters card details
  // =====================================================
  async createSetupIntent(req, res) {
    const customer = await stripe.customers.create();

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    return { setupIntent, customer };
  }

  // =====================================================
  // 2️⃣ Store card info in reservation table
  // =====================================================
  async storeCardDetails(reservationId, stripeCustomerId, stripePaymentMethodId) {
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    await reservation.update({
      stripeCustomerId,
      stripePaymentMethodId,
    });

    return reservation;
  }

  // =====================================================
  // 3️⃣ Charge late cancellation fee (£12)
  // =====================================================
  async chargeLateFee(reservationId) {
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (!reservation.stripeCustomerId || !reservation.stripePaymentMethodId) {
      throw new Error("Missing stored card details");
    }

    // Stripe charge £12 (1200 pence)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1200,
      currency: "gbp",
      customer: reservation.stripeCustomerId,
      payment_method: reservation.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      description: "Late cancellation / No-show fee",
    });

    return paymentIntent;
  }







  async deleteReservation(id) {
    return await Reservation.destroy({ where: { id } });
  }
}

const reservationServiceObj = new ReservationService();
export default reservationServiceObj;
