// import reservationServiceObj from '../services/reservation.service.js';

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
import stripe from '../config/stripe.js'
import { cancellationPolicy, dropdownOptions } from '../helper/staticData.js';

class ReservationController {
  // STEP 1 — Create base reservation
  async createStep1(req, res) {
    try {
      const userObj = req.userData
      const { date, time, partySize } = req.body;

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
  async createPaymentIntent(req, res) {
    try {
      const { reservationId } = req.body;

      // Check reservation exists
      const reservation = await reservationServiceObj.getReservationById(reservationId);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found' });
      }

      // Create Stripe Payment Intent for £5 (500 pence)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 500, // in pence
        currency: 'gbp',
        description: `Reservation Deposit for ID: ${reservation.id}`,
        metadata: { reservationId: reservation.id },
      });

      // Save paymentIntentId to DB
      await reservationServiceObj.updateReservation(reservation.id, {
        paymentIntentId: paymentIntent.id,
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        message: 'Payment intent created successfully',
      });
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      return res.status(500).json({ success: false, message: 'Stripe Payment Error' });
    }
  }



}

const reservationController = new ReservationController();
export default reservationController;

