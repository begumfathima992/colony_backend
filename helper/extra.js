import jwt from 'jsonwebtoken'
import Reservation from '../models/reservation.model.js';
import stripe, { stripeWebhookSecret } from '../config/stripe.js'
import env from '../config/environmentVariables.js';

export function encryptStringWithKey(text) {
    const password = btoa(text);
    // console.log(password, 'wwwwwwwwwwwwwwwwww');
    return password;
}

export const generateAccessToken = (payload) => {
    let token = jwt.sign(payload, "vape_db"
        // , {
        //     expiresIn: '30d', // 1d', '30m'
        // }
    );
    return token;
};



export const createPaymentIntent = async (amount, reservationId) => {
    try {
        const findOne = await Reservation.findOne({
            where: {
                id: reservationId,
            },
            raw: true
        });

        let staticCharge = env.ZIGGY_PER_PERSON_FEE
        let totalFee = Number(staticCharge) * Number(findOne?.partySize)

        totalFee = amount// ise commment kr dena

        // return
        if (!findOne) {
            return {
                status: false,
                message: "Reservation not found"
            }
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

        await Reservation?.update(obj, { where: { id: reservationId } })

        // res.json({
        //     clientSecret: paymentIntent.client_secret,
        //     ephemeralKey: ephemeralKey.secret,
        //     customer: customer.id,
        // });
        return true

    } catch (err) {
        console.error(err, 'create patent error')
        return { message: err?.message, statusCode: 500, success: false }
    }
}

export function isWithin24Hours(date, time) {
    let theDate = `${date}T${time}:00`;
    const storedDate = new Date(theDate);
    // console.log(storedDate,'storedDate,')
    const now = new Date();
    console.log(now, 'noww', storedDate, 'storedDate,storedDate,')
    // return
    const diffInMs = storedDate - now; // milliseconds
    const hours = diffInMs / (1000 * 60 * 60);
    console.log(hours <= 24, 'hours <= 24', hours)
    return hours <= 24;
}
// isWithin24Hours('2025-12-23', '23:03')