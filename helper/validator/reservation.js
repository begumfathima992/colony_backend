import Joi from 'joi'


export const cart_detail_save = Joi.object({
    reservationId: Joi.string().required().label("reservation"),
    cardDetails: Joi.object({
        cardNumber: Joi.number().required().label('cardNumber'),
        cardExpiry: Joi.string().required().label('cardExpiry'),
        CVV: Joi.number().required().label("CVV")
    }).required().label('cardDetails'),
    isAcceptCancellation: Joi.boolean().label("is Accept Cancellation")
})


export const cancellation_reservation = Joi.object({
    reservationId: Joi.string().required().label("reservation"),
    cancel: Joi.boolean().label("cancel")
})

