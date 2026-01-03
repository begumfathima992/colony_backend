import Reservation from "../models/reservation.model.js";

import stripe, { stripeWebhookSecret } from '../config/stripe.js'
import env from "../config/environmentVariables.js";
import cardDetailModel from "../models/cardDetails.js";
import { createPaymentIntent, isWithin24Hours } from "../helper/extra.js";


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
  // async storeCardDetails(reservationId, stripeCustomerId, stripePaymentMethodId) {
  //   const reservation = await Reservation.findByPk(reservationId);

  //   if (!reservation) {
  //     throw new Error("Reservation not found");
  //   }

  //   await reservation.update({
  //     stripeCustomerId,
  //     stripePaymentMethodId,
  //   });

  //   return reservation;
  // }





// async storeCardDetails(req, res) {
//   try {
//     const { reservationId, stripeCustomerId, stripePaymentMethodId } = req.body;

//     // 1. Find the specific reservation
//     const reservation = await Reservation.findByPk(reservationId);

//     if (!reservation) {
//       console.error(`Reservation with ID ${reservationId} not found.`);
//       return res.status(404).json({ success: false, message: "Reservation not found" });
//     }

//     // 2. Update using the exact column names from your provided model
//     await reservation.update({
//       stripeCustomerId: stripeCustomerId,      // Matches model
//       stripePaymentMethodId: stripePaymentMethodId, // Matches model
//     });

//     console.log(`Success: Linked PM ${stripePaymentMethodId} to Reservation ${reservationId}`);

//     return res.status(200).json({
//       success: true,
//       message: "Card details stored successfully",
//     });

//   } catch (err) {
//     // This will print the exact SQL error (e.g., column does not exist)
//     console.error("DATABASE UPDATE ERROR:", err); 
//     return res.status(500).json({ 
//       success: false, 
//       message: "Failed to store card details",
//       error: err.message 
//     });
//   }
// }





async storeCardDetails(reservationId, stripeCustomerId, stripePaymentMethodId) {
        try {
            const reservation = await Reservation.findByPk(reservationId);

            if (!reservation) {
                throw new Error("Reservation not found in database");
            }

            // Update using exact column names from your Reservation Model
            return await reservation.update({
                stripeCustomerId: stripeCustomerId,
                stripePaymentMethodId: stripePaymentMethodId,
            });
        } catch (error) {
            console.error("Service Error:", error.message);
            throw error; // Pass the error back to the controller
        }
    }


  // =====================================================
  // 3️⃣ Charge late cancellation fee (£12)
  // =====================================================
 async cancellation_reservation(req, res) {
    try {
        let { reservationId, cancel } = req.body;
        
        // 1. Find the reservation with the stored Stripe IDs
        let reservation = await Reservation.findOne({ where: { id: reservationId } });
        
        if (!reservation) {
            return res.status(404).json({ status: false, message: "Reservation not found" });
        }

        // 2. Check if cancellation happens within the 24-hour window
        let isLate = isWithin24Hours(reservation.date, reservation.time);

        if (isLate) {
            // Check if we have the cards to charge
            if (!reservation.stripeCustomerId || !reservation.stripePaymentMethodId) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Late cancellation fee applies, but no saved card was found." 
                });
            }

            // 3. Calculate Fee (e.g., £12 per person or static £12)
            let perPersonCost = env.ZIGGY_PER_PERSON_FEE || 12;
            let totalCost = Number(reservation.partySize) * Number(perPersonCost) * 100; // Multiply by 100 for cents/pence

            // 4. Charge the saved card automatically
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: totalCost,
                    currency: "gbp",
                    customer: reservation.stripeCustomerId,
                    payment_method: reservation.stripePaymentMethodId,
                    off_session: true, // User is not looking at the app
                    confirm: true,    // Charge immediately
                    description: `Late cancellation fee for Reservation #${reservationId}`,
                });

                console.log("Stripe Auto-Charge Success:", paymentIntent.id);
            } catch (stripeError) {
                console.error("Stripe Charge Failed:", stripeError.message);
                return res.status(402).json({ 
                    status: false, 
                    message: `Charge failed: ${stripeError.message}. Please contact support.` 
                });
            }
        }

        // 5. Update the Database status to Cancelled
        // This runs for BOTH free cancellations and successful late-fee cancellations
        await Reservation.update(
            { reservationCancel: cancel }, 
            { where: { id: reservationId } }
        );

        return res.status(200).json({ 
            status: true,
            message: isLate ? "Reservation cancelled and fee charged." : "Reservation cancelled successfully.",
            requiresPayment: false // Frontend doesn't need to show Stripe Sheet
        });

    } catch (error) {
        console.error("Cancellation Controller Error:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
}




  async deleteReservation(id) {
    return await Reservation.destroy({ where: { id } });
  }

  async save_card_details(req, res) {
    try {
      let { reservationId, phone, cardDetails, isAcceptCancellation, cardDetailId } = req.body;
      let userData = req.userData;

      // Find the reservation
      let reservation = await Reservation.findOne({
        where: { user_id: userData.id, id: reservationId },
        raw: true
      });

      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found', success: false, statusCode: 404 });
      }

      // ✅ If cardDetailId is missing, create it
      if (!cardDetailId) {
        const newCard = await cardDetailModel.create({
          cardNumber: cardDetails.cardNumber,
          cardExpiry: cardDetails.cardExpiry,
          CVV: cardDetails.CVV,
          user_id: userData.id
        });
        cardDetailId = newCard.id;
      }

      // Update reservation
      await Reservation.update(
        {
          cardDetails,
          isAcceptCancellation,
          status: "CONFIRMED",
          cardDetailId
        },
        { where: { id: reservationId, user_id: userData.id } }
      );

      return res.status(200).json({ message: 'Details saved successfully', success: true, statusCode: 200 });

    } catch (error) {
      console.error('save_card_details error:', error);
      return res.status(500).json({ message: error.message, success: false, statusCode: 500 });
    }
  }

// async save_card_details(req, res) {
//   try {
//     const {
//       reservationId,
//       cardDetails,
//       isAcceptCancellation,
//       cardDetailId: incomingCardDetailId
//     } = req.body;

//     const userData = req.userData;

//     // 1️⃣ Basic validations
//     if (!reservationId) {
//       return res.status(400).json({
//         message: 'reservationId is required',
//         success: false,
//         statusCode: 400,
//       });
//     }

//     if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cardExpiry) {
//       return res.status(400).json({
//         message: 'Invalid card details',
//         success: false,
//         statusCode: 400,
//       });
//     }

//     // 2️⃣ Find reservation
//     const reservation = await Reservation.findOne({
//       where: {
//         id: reservationId,
//         user_id: userData.id,
//       },
//     });

//     if (!reservation) {
//       return res.status(404).json({
//         message: 'Reservation not found',
//         success: false,
//         statusCode: 404,
//       });
//     }

//     // 3️⃣ Create card if cardDetailId not provided
//     let cardDetailId = incomingCardDetailId;

//     if (!cardDetailId) {
//       const newCard = await cardDetailModel.create({
//         user_id: userData.id,
//         cardNumber: cardDetails.cardNumber,
//         cardExpiry: cardDetails.cardExpiry,
//         // ❌ DO NOT STORE CVV IN REAL APPS
//         // CVV removed for security
//       });

//       cardDetailId = newCard.id;
//     }

//     // 4️⃣ Update reservation
//     await Reservation.update(
//       {
//         cardDetailId,
//         cardDetails, // ⚠️ acceptable for now since frontend expects it
//         isAcceptCancellation: !!isAcceptCancellation,
//         status: 'CONFIRMED',
//       },
//       {
//         where: {
//           id: reservationId,
//           user_id: userData.id,
//         },
//       }
//     );

//     return res.status(200).json({
//       message: 'Details saved successfully',
//       success: true,
//       statusCode: 200,
//     });

//   } catch (error) {
//     console.error('save_card_details error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//       success: false,
//       statusCode: 500,
//     });
//   }
// }

// async save_card_details(req, res) {
//   try {
//     const {
//       reservationId,
//       cardDetails,
//       isAcceptCancellation,
//       cardDetailId: incomingCardDetailId
//     } = req.body;

//     const userData = req.userData;

//     // 1️⃣ Basic validations
//     if (!reservationId) {
//       return res.status(400).json({
//         message: 'reservationId is required',
//         success: false,
//         statusCode: 400,
//       });
//     }

//     if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cardExpiry) {
//       return res.status(400).json({
//         message: 'Invalid card details',
//         success: false,
//         statusCode: 400,
//       });
//     }

//     // 2️⃣ Find reservation
//     const reservation = await Reservation.findOne({
//       where: {
//         id: reservationId,
//         user_id: userData.id,
//       },
//     });

//     if (!reservation) {
//       return res.status(404).json({
//         message: 'Reservation not found',
//         success: false,
//         statusCode: 404,
//       });
//     }

//     // 3️⃣ Create card if cardDetailId not provided
//     let cardDetailId = incomingCardDetailId;

//     if (!cardDetailId) {
//       const newCard = await cardDetailModel.create({
//         user_id: userData.id,
//         cardNumber: cardDetails.cardNumber,
//         cardExpiry: cardDetails.cardExpiry,
//         // ❌ DO NOT STORE CVV IN REAL APPS
//         // CVV removed for security
//       });

//       cardDetailId = newCard.id;
//     }

//     // 4️⃣ Update reservation
//     await Reservation.update(
//       {
//         cardDetailId,
//         cardDetails, // ⚠️ acceptable for now since frontend expects it
//         isAcceptCancellation: !!isAcceptCancellation,
//         status: 'CONFIRMED',
//       },
//       {
//         where: {
//           id: reservationId,
//           user_id: userData.id,
//         },
//       }
//     );

//     return res.status(200).json({
//       message: 'Details saved successfully',
//       success: true,
//       statusCode: 200,
//     });

//   } catch (error) {
//     console.error('save_card_details error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//       success: false,
//       statusCode: 500,
//     });
//   }
// }



////////sir code

  // async cancellation_reservation(req, res) {
  //   try {
  //     let { reservationId, cancel } = req.body
  //     let get = await Reservation?.findOne({ where: { id: reservationId } })

  //     let perPersonCost = env.ZIGGY_PER_PERSON_FEE
  //     let totalCost = Number(get?.partySize) * Number(perPersonCost)
  //     // console.log(totalCost, 'total costtttt')
  //     let check = isWithin24Hours(get?.date, get?.time)

  //     if (check) {
  //       let chekcc = await createPaymentIntent(totalCost, reservationId)
  //       if (chekcc && chekcc?.status == false) {
  //         return res.status(404).json({
  //           status: false,
  //           message: "Reservation not found"
  //         })
  //       }
  //     }
  //     await Reservation?.update({ reservationCancel: cancel }, { where: { id: reservationId } })
  //     return res.status(200).json({ message: "Reservation Cancelled", status: 200 })
  //   } catch (error) {
  //     return res.status(500).json({ message: error?.message, statusCode })
  //   }
  // }





//   async cancellation_reservation(req, res) {
//     try {
//         let { reservationId, cancel } = req.body;
        
//         // 1. Find the reservation
//         let get = await Reservation?.findOne({ where: { id: reservationId } });
//         if (!get) {
//             return res.status(404).json({ status: false, message: "Reservation not found" });
//         }

//         let perPersonCost = env.ZIGGY_PER_PERSON_FEE;
//         let totalCost = Number(get?.partySize) * Number(perPersonCost);
        
//         // 2. Check if cancellation happens within the 24-hour window
//         let check = isWithin24Hours(get?.date, get?.time);

//       if (check) {
//     let paymentData = await createPaymentIntent(totalCost, reservationId, get.user_id);
//     console.log(paymentData,"paymentDatapaymentData===")
//     // Check if paymentData actually contains the secret
//     if (paymentData && paymentData.client_secret) {
//         return res.status(200).json({
//             status: true,
//             requiresPayment: true,
//             paymentIntent: paymentData.client_secret, // Must be the 'client_secret' string
//             customer: paymentData.customer,           // Stripe Customer ID
//             ephemeralKey: paymentData.ephemeralKey,   // Ephemeral Key
//             message: "Payment required"
//         });
//     }
// }

//         // 5. If OUTSIDE 24 hours (no fee), update and cancel immediately
//         await Reservation?.update(
//             { reservationCancel: cancel }, 
//             { where: { id: reservationId } }
//         );

//         return res.status(200).json({ 
//             message: "Reservation Cancelled (No fee applied)", 
//             status: 200,
//             requiresPayment: false 
//         });

//     } catch (error) {
//         return res.status(500).json({ message: error?.message, status: 500 });
//     }
// }




  async fetch_all_reservation(req, res) {
    try {
      // console.log(req,"=========>>>>>>req")
      let userObj = req.userData
      let reservations = await Reservation?.findAll({ where: { user_id: userObj.id }, raw: true })

      console.log(reservations, "=========>>>>>>reservationsreservationsreservations")
      const now = new Date();
      for (let i = 0; i < reservations.length; i++) {

        // Convert DB date + time into a single datetime
        const reservationDateTime = new Date(`${reservations[i].date} ${reservations[i].time}`);

        // Calculate hours difference
        const diffMs = reservationDateTime - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours <= 24) {
          // ❗ Within last 24 hours → charges apply
          reservations[i].canCancel = true;
          reservations[i].cancellationFee = 10;
          reservations[i].isPaid = true;
        } else {
          // ✔ More than 24 hours → no fee
          reservations[i].canCancel = true;
          reservations[i].cancellationFee = 0;
          reservations[i].isPaid = false;
        }
        reservations[i].amount = env.ZIGGY_PER_PERSON_FEE * reservations[i].partySize
        // if (i == 0) {
        //   get[i].isPaid = true
        //   get[i].cancellationFee = 10
        //   get[i].canCancel = true

        // } else {

        //   get[i].isPaid = false
        //   get[i].cancellationFee = 10
        //   get[i].canCancel = false
        // }
      }
      return res.status(200).json({ message: "Reservation fetched", data: reservations, status: 200 })
    } catch (error) {
      console.log(error, "====>get error")
      return res.status(500).json({ message: error?.message, statusCode })
    }
  }


  async save_card_details_by_cardid(req, res) {
    try {
      let {
        reservationId,
        cardDetailId,
        isAcceptCancellation
      } = req.body

      let userData = req.userData

      let findObj = await Reservation.findOne({ where: { user_id: userData?.id, id: reservationId }, raw: true })
      if (!findObj) {
        return res.status(404).json({ message: 'Reservation data not found', statusCode: 404, success: false })
      }

      let saveObj = {
        cardDetailId, isAcceptCancellation, status: "CONFIRMED"
      }
      await Reservation?.update(saveObj, { where: { id: reservationId, user_id: userData?.id } })
      return res.status(200).json({ message: "Details saved success", statusCode: 200, success: true })

    } catch (error) {
      console.log(error, "save_card_Detals")
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }

  //CRUD card details 

}

const reservationServiceObj = new ReservationService();
export default reservationServiceObj;
