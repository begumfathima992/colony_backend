import express from 'express';
import reservationController from '../controllers/reservation.controller.js';
import { authorize } from '../helper/auth.js'; // JWT/auth middleware

const router = express.Router();

// ----------------------
// STEP 1 — Create base reservation
// ----------------------
router.post('/createRes', authorize, reservationController.createStep1);
router.put('/updateRes', authorize, reservationController.updateReservation);

// ----------------------
// Payments
// ----------------------
router.post("/create-payment-intent", reservationController.createPayment);

// **Webhook route should NOT use authorize**
router.post("/webhook", express.raw({ type: 'application/json' }), reservationController.webHook);





router.post("/create-setup-intent", reservationController.createSetupIntent);
router.post("/store-card", reservationController.storeCard);
router.get(
  '/get_by_id',
authorize,
  reservationController.getSavedCards
);
router.put('/save_card_details',  authorize, reservationController.saveCardDetails);

router.delete('/delete_data', authorize, reservationController.delete_data);






router.post("/charge-late-fee", reservationController.chargeLateFee);

router.put("/save_card_details",authorize, reservationController.save_card_details);

router.put("/cancellation_reservation",reservationController.cancellation_reservation)
router.get("/get_reservations",authorize,reservationController.fetch_all_reservation)

/////carddata

/////////
router.put('/finalize', authorize, reservationController.finalizeReservation);

// ----------------------
// Optional Step 2 routes
// ----------------------
// router.get('/:id', authorize, reservationController.getReservationDetails);
// router.put('/update/:id', authorize, reservationController.updateStep2);
// router.post('/pay/:reservationId', authorize, reservationController.createPaymentIntent);

export default router;
