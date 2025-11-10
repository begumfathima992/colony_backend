import Reservation from "../models/reservation.model.js";

import stripe, { stripeWebhookSecret } from '../config/stripe.js'
import env from "../config/environmentVariables.js";


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

  /////////////--- reservation ho pehle 
  async createPaymentIntent(req, res) {
    try {
      const userData = req.userData
      //  userData.id = 36

      let { amount, reservationId, } = req.body

      const findOne = await Reservation.findOne({
        where: {
          id: reservationId,
          user_id: userData?.id
        },
        raw: true
      });


      let staticCharge = env.ZIGGY_PER_PERSON_FEE
      let totalFee = Number(staticCharge) * Number(findOne?.partySize)

      totalFee = amount// ise commment kr dena

      // console.log(totalFee, findOne, userData.id, reservationId, "=========>>>>>>")
      // return
      if (!findOne) {

        return res.status(404).json({
          status: false,
          message: "Reservation not found"
        })
      }

      const customer = await stripe.customers.create();
      console.log('Customer created:', customer.id);
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-06-20' } // ✅ REQUIRED
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalFee,
        currency: 'eur',
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });
      // const obj = {
      //   customer_id: customer.id,
      //   clientSecret: paymentIntent.client_secret,
      //   ephemeralKey: ephemeralKey.secret,
      // }


      let obj = {
        customer_id: customer?.id,
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret
      }

      await Reservation?.update(obj, { where: { user_id: userData?.id, id: reservationId } })

      res.json({
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      });
      return

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

  async save_card_details(req, res) {
    try {
      let {
        reservationId,
        phone,
        cardDetails,
        isAcceptCancellation
      } = req.body

      let userData = req.userData

      let findObj = await Reservation.findOne({ where: { user_id: userData?.id, id: reservationId }, raw: true })
      if (!findObj) {
        return res.status(404).json({ message: 'Reservation data not found', statusCode: 404, success: false })
      }
      let saveObj = {
        cardDetails, isAcceptCancellation
      }
      await Reservation?.update(saveObj, { where: { id: reservationId, user_id: userData?.id } })
      return res.status(200).json({ message: "Details saved success", statusCode: 200, success: true })

    } catch (error) {
      console.log(error, "save_card_Detals")
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }

  async cancellation_reservation(req, res) {
    try {
      let { reservationId, cancel } = req.body
      await Reservation?.update({ reservationCancel: cancel }, { where: { id: reservationId } })
      return res.status(200).json({ message: "Reservation Cancelled", status: 200 })
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode })
    }
  }

  async fetch_all_reservation(req, res) {
    try {
      let userObj = req.userData
      let get = await Reservation?.findAll({ where: { user_id: userObj.id }, raw: true })

      for (let i = 0; i < get.length; i++) {
        if (i = 0) {
          get[i].isPaid = true
          get[i].cancellationFee = 10
          get[i].canCancel = true

        } else {

          get[i].isPaid = false
          get[i].cancellationFee = 10
          get[i].canCancel = false
        }
      }
      return res.status(200).json({ message: "Reservation fetched", data: get, status: 200 })
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode })
    }
  }
}

const reservationServiceObj = new ReservationService();
export default reservationServiceObj;
