import express from 'express';
import reservationController from '../controllers/reservation.controller.js';
// import authMiddleware from '../middleware/auth.js'; // if you have JWT auth
import { authorize } from '../helper/auth.js'
const router = express.Router();

// router.use(authMiddleware); // uncomment if protected

router.post('/create', authorize,reservationController.create);
router.get('/by-date', authorize,reservationController.getByDate);
router.get('/user/:user_id', authorize,reservationController.getUserReservations);

export default router;
