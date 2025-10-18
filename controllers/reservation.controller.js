import reservationServiceObj from '../services/reservation.service.js';

class ReservationController {
  async create(req, res) {
    try {
      // Use req.userData from authorize middleware
      const user_id = req.userData?.id || req.body.user_id; 
      const { date, time, partySize, tableNumber, note, paymentIntentId } = req.body;

      if (!date || !time || !partySize) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: date, time, or partySize' 
        });
      }

      const reservation = await reservationServiceObj.createReservation({
        user_id,
        date,
        time,
        partySize,
        tableNumber: tableNumber || null,
        note: note || null,
        paymentIntentId: paymentIntentId || null,
        status: 'PENDING', // default status
      });

      return res.status(201).json({ success: true, reservation });
    } catch (error) {
      console.error('Create Reservation Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async getByDate(req, res) {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).json({ success: false, message: 'Date query is required' });

      const reservations = await reservationServiceObj.getReservationsByDate(date);
      return res.status(200).json({ success: true, reservations });
    } catch (error) {
      console.error('Get Reservations Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  async getUserReservations(req, res) {
    try {
      // Use req.userData from authorize middleware
      const user_id = req.userData?.id || req.params.user_id;
      if (!user_id) return res.status(400).json({ success: false, message: 'User ID is required' });

      const reservations = await reservationServiceObj.getUserReservations(user_id);
      return res.status(200).json({ success: true, reservations });
    } catch (error) {
      console.error('Get User Reservations Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}

const reservationController = new ReservationController();
export default reservationController;
