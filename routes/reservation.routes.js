// import express from 'express';
// import reservationController from '../controllers/reservation.controller.js';
// // import authMiddleware from '../middleware/auth.js'; // if you have JWT auth
// import { authorize } from '../helper/auth.js'
// const router = express.Router();

// // router.use(authMiddleware); // uncomment if protected

// router.post('/create', authorize,reservationController.create);
// router.get('/by-date', authorize,reservationController.getByDate);
// router.get('/user/:user_id', authorize,reservationController.getUserReservations);

// export default router;

import express from 'express';
import reservationController from '../controllers/reservation.controller.js';
import { authorize } from '../helper/auth.js'; // JWT/auth middleware
// import { createPaymentIntent } from '../controllers/payment.controller.js';

const router = express.Router();

// ----------------------
// STEP 1 — Create base reservation
// ----------------------
router.post('/createRes', authorize, reservationController.createStep1);

// ----------------------
// STEP 2 — Get reservation details for second screen
// ----------------------
// router.get('/:id', authorize, reservationController.getReservationDetails);

// ----------------------
// STEP 2 — Update reservation with dietary, occasion, cancellation
// ----------------------
// router.put('/update/:id', authorize, reservationController.updateStep2);
router.post('/pay/:reservationId', authorize, reservationController.createPaymentIntent);


// Optional: other routes for admin/management
// router.get('/by-date', authorize, reservationController.getByDate);
// router.get('/user/:user_id', authorize, reservationController.getUserReservations);

export default router;

