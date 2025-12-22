// import reservationServiceObj from '../services/reservation.service.js';
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

// class ReservationController {
//   async create(req, res) {
//     try {
//       // Use req.userData from authorize middleware
//       const user_id = req.userData?.id || req.body.user_id; 
//       const { date, time, partySize, tableNumber, note, paymentIntentId } = req.body;

//       if (!date || !time || !partySize) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Missing required fields: date, time, or partySize' 
//         });
//       }

//       const reservation = await reservationServiceObj.createReservation({
//         user_id,
//         date,
//         time,
//         partySize,
//         tableNumber: tableNumber || null,
//         note: note || null,
//         paymentIntentId: paymentIntentId || null,
//         status: 'PENDING', // default status
//       });

//       return res.status(201).json({ success: true, reservation });
//     } catch (error) {
//       console.error('Create Reservation Error:', error);
//       return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   }

//   async getByDate(req, res) {
//     try {
//       const { date } = req.query;
//       if (!date) return res.status(400).json({ success: false, message: 'Date query is required' });

//       const reservations = await reservationServiceObj.getReservationsByDate(date);
//       return res.status(200).json({ success: true, reservations });
//     } catch (error) {
//       console.error('Get Reservations Error:', error);
//       return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   }

//   async getUserReservations(req, res) {
//     try {
//       // Use req.userData from authorize middleware
//       const user_id = req.userData?.id || req.params.user_id;
//       if (!user_id) return res.status(400).json({ success: false, message: 'User ID is required' });

//       const reservations = await reservationServiceObj.getUserReservations(user_id);
//       return res.status(200).json({ success: true, reservations });
//     } catch (error) {
//       console.error('Get User Reservations Error:', error);
//       return res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   }
// }

// const reservationController = new ReservationController();
// export default reservationController;
import reservationServiceObj from '../services/reservation.service.js';
import { User } from '../models/index.model.js'; // User model
import stripe, { stripeWebhookSecret } from '../config/stripe.js'
import { cancellationPolicy, dropdownOptions } from '../helper/staticData.js';
import moment from 'moment';
import { cancellation_reservation, cart_detail_save } from '../helper/validator/reservation.js';

class ReservationController {
  // STEP 1 — Create base reservation
  async createStep1(req, res) {
    try {
      console.log(req.body, "=====>req create")
      const userObj = req.userData
      let { date, time, partySize } = req.body;
      // Convert given time to minutes (HH:MM format)
      const [hour, minute] = time.split(":").map(Number);
      const totalMinutes = hour * 60 + minute;

      // Allowed range
      const minTime = 17 * 60; // 5:00 PM
      const maxTime = 22 * 60; // 10:00 PM

      if (totalMinutes < minTime || totalMinutes > maxTime) {
        return res.status(400).json({
          message: "Time must be between 5:00 PM and 10:00 PM",
          statusCode: 400
        });
      }
      // --------------------------
      // Validate Date >= 24 hours
      // --------------------------
      const reservationDate = new Date(`${date} ${time}`);
      // const reservationDate = new Date(date);     // user selected date
      const currentDate = new Date();             // now
      const after24Hours = new Date(currentDate.getTime()
        // + 24 * 60 * 60 * 1000
      );
      console.log(reservationDate, "date===>", after24Hours, "after24Hours=======>>>>>")
      if (reservationDate.getTime() < after24Hours.getTime()) {
        return res.status(400).json({
          message: "Booking is not allowed for a prior or expired time slot.",
          statusCode: 400
        });
      }
      date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD') // ✅ safe forma
      if (!date || !time || !partySize) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: date, time, or partySize',
        });
      }

      const reservation = await reservationServiceObj.createReservation({
        user_id: userObj?.id,
        date,
        time,
        partySize,
        status: 'PENDING',
      });
      delete userObj?.password
      delete userObj?.access_token
      delete userObj?.createdAt
      delete userObj?.updatedAt
      reservation.reservationId = reservation?.id
      let obj = {
        reservation,
        userObj,
        dropdownOptions,
        cancellationPolicy
      }

      return res.status(201).json({ success: true, obj });
    } catch (error) {
      console.error('Create Step1 Reservation Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }


  // controllers/reservation.controller.js

  async updateReservation(req, res) {
    try {
      const { reservationId, extraOptions, userDietaryByParty, userDietary, userOccasion, userNotes, cancellationPolicy } = req.body;

      if (!reservationId)
        return res.status(400).json({ success: false, message: "Missing reservation ID" });

      await reservationServiceObj.updateReservationDetails(req, res);


    } catch (error) {
      console.error("Update Reservation Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }




  // STEP 2 — Get reservation + user details for second screen
  //  async getReservationDetails(req, res) {
  //   try {
  //     const { id } = req.params;

  //     // Get reservation by ID
  //     const reservation = await reservationServiceObj.getReservationById(id);
  //     if (!reservation) {
  //       return res.status(404).json({ success: false, message: 'Reservation not found' });
  //     }

  //     // Get user details
  //     const user = await User.findByPk(reservation.user_id, {
  //       attributes: ['id', 'name', 'phone'], // match actual column names
  //     });

  //     // Build response
  //     const response = {
  //       id: reservation.id,
  //       userName: user?.name || '',       // use 'name'
  //       phoneNumber: user?.phone || null, // use 'phone'
  //       date: reservation.date,
  //       time: reservation.time,
  //       partySize: reservation.partySize,
  //       dietaryRestrictionByUser: reservation.dietaryRestrictionByUser,
  //       dietaryRestrictionByParty: reservation.dietaryRestrictionByParty,
  //       occasion: reservation.occasion,
  //       cancellationPolicyAccepted: reservation.cancellationPolicyAccepted,
  //     };

  //     // Dropdown options
  //     const dropdownOptions = {
  //       dietaryRestrictionByUser: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'None'],
  //       dietaryRestrictionByParty: ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'None'],
  //       occasions: ['Birthday', 'Anniversary', 'Business Meeting', 'Other'],
  //     };

  //     return res.status(200).json({ success: true, reservation: response, dropdownOptions });
  //   } catch (error) {
  //     console.error('Get Reservation Details Error:', error);
  //     return res.status(500).json({ success: false, message: 'Internal Server Error' });
  //   }
  // }


  //   // STEP 2 — Update reservation with user input (dietary, occasion, cancellation)
  //   async updateStep2(req, res) {
  //     try {
  //       const { id } = req.params;
  //       const {
  //         dietaryRestrictionByUser,
  //         dietaryRestrictionByParty,
  //         occasion,
  //         cancellationPolicyAccepted,
  //       } = req.body;

  //       if (!cancellationPolicyAccepted) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'You must accept the cancellation policy to proceed',
  //         });
  //       }

  //       const updatedReservation = await reservationServiceObj.updateReservation(id, {
  //         dietaryRestrictionByUser: dietaryRestrictionByUser || null,
  //         dietaryRestrictionByParty: dietaryRestrictionByParty || null,
  //         occasion: occasion || null,
  //         cancellationPolicyAccepted: true,
  //       });

  //       return res.status(200).json({ success: true, updatedReservation });

  //     } catch (error) {
  //       console.error('Update Step2 Reservation Error:', error);
  //       return res.status(500).json({ success: false, message: 'Internal Server Error' });
  //     }
  //   }
  ///////////////





  //   async createPayment(req, res) {
  //     try {
  //       const { amount, currency, phone } = req.body;

  //       if (!amount) return res.status(400).json({ message: "Amount is required" });

  //       const paymentIntent = await reservationServiceObj.createPaymentIntent(amount, currency, phone);
  // console.log(paymentIntent,"paymentIntentpaymentIntentpaymentIntent")
  //       res.status(200).json({
  //         success: true,
  //         clientSecret: paymentIntent.client_secret,
  //       //   ephemeralKey: ephemeralKey.secret,
  //       // customer: customer.id,

  //       });
  //     } catch (err) {
  //       console.error("Stripe error:", err);
  //       res.status(500).json({ success: false, message: "Payment failed" });
  //     }
  //   };


  ///////
  // async createPayment(req, res) {
  //   try {
  //     await reservationServiceObj.createPaymentIntent(req, res)
  //   } catch (err) {
  //     console.error('Stripe Error:', err);
  //     res.status(500).json({ error: err.message });
  //     return
  //   }
  // };


  async createPayment(req, res) {
    try {
      const { amount } = req.body;

      const customer = await stripe.customers.create();
      console.log('Customer created:', customer.id);
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2024-06-20' } // ✅ REQUIRED
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'aed',
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      });
    } catch (err) {
      console.error('Stripe Error:', err);
      res.status(500).json({ error: err.message });
    }
  };



  async webHook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("✅ Payment succeeded:", event.data.object.id);
        break;

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.sendStatus(200);
    return;
  }
  // =====================================================
  // 1️⃣ Create SetupIntent — collect card without charging
  // =====================================================
  async createSetupIntent(req, res) {
    try {
      const { setupIntent, customer } = await reservationServiceObj.createSetupIntent(req, res);

      res.status(200).json({
        success: true,
        clientSecret: setupIntent.client_secret,
        customer: customer.id,
      }
      );
      return;
    } catch (err) {
      console.error("SetupIntent Error:", err);
      res.status(500).json({ success: false, message: "Failed to create SetupIntent" });
      return;
    }

  }

  // =====================================================
  // 2️⃣ Store card details with reservation
  // =====================================================
  async storeCard(req, res) {
    try {
      const { reservationId, stripeCustomerId, stripePaymentMethodId } = req.body;

      if (!reservationId || !stripeCustomerId || !stripePaymentMethodId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      await reservationServiceObj.storeCardDetails(reservationId, stripeCustomerId, stripePaymentMethodId);

      res.status(200).json({
        success: true,
        message: "Card details stored successfully",
      });
    } catch (err) {
      console.error("Store Card Error:", err);
      res.status(500).json({ success: false, message: "Failed to store card details" });
    }
  }

  // =====================================================
  // 3️⃣ Charge £12 late cancellation / no-show fee
  // =====================================================
  async chargeLateFee(req, res) {
    try {
      const { reservationId } = req.body;

      if (!reservationId) {
        return res.status(400).json({ success: false, message: "Reservation ID is required" });
      }

      const paymentIntent = await reservationServiceObj.chargeLateFee(reservationId);

      res.status(200).json({
        success: true,
        message: "Late cancellation fee charged successfully",
        paymentIntent,
      });
    } catch (err) {
      console.error("Charge Late Fee Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async save_card_details(req, res) {
    try {
      console.log(req.body, "======>body")
      let { error } = cart_detail_save.validate(req.body, options)
      console.log(error, "Eeeeeeeeeeeee", req.body, "bodyyy")
      if (error) {
        return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
      }
      await reservationServiceObj?.save_card_details(req, res)
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }

  async cancellation_reservation(req, res) {
    try {
      console.log(req.body, "bodyy====Eeeeeeeeeeeee")
      let { error } = cancellation_reservation.validate(req.body, options)
      // console.log(error, "Eeeeeeeeeeeee")
      if (error) {
        return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
      }
      await reservationServiceObj?.cancellation_reservation(req, res)
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }

  async fetch_all_reservation(req, res) {
    try {

      await reservationServiceObj?.fetch_all_reservation(req, res)
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }

}

const reservationController = new ReservationController();
export default reservationController;

