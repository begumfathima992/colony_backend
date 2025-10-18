import { Reservation } from '../models/index.model.js'; // central models import

class ReservationService {
  async createReservation(data) {
    // Create a new reservation
    return await Reservation.create(data);
  }

  async getReservationsByDate(date) {
    // Find reservations by date
    return await Reservation.findAll({ where: { date }, order: [['time', 'ASC']] });
  }

  async getUserReservations(user_id) {
    // Find reservations by user_id
    return await Reservation.findAll({ where: { user_id }, order: [['date', 'ASC'], ['time', 'ASC']] });
  }

  async updateReservation(id, data) {
    // Update reservation and return updated record
    await Reservation.update(data, { where: { id } });
    return await Reservation.findByPk(id);
  }

  async deleteReservation(id) {
    // Delete reservation
    return await Reservation.destroy({ where: { id } });
  }
}

const reservationServiceObj = new ReservationService();
export default reservationServiceObj;
