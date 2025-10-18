import User from './user.model.js';
import Reservation from './reservation.model.js';

// Associations
User.hasMany(Reservation, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

export { User, Reservation };