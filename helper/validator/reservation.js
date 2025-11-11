import Joi from 'joi'


export const cart_detail_save = Joi.object({
    reservationId: Joi.number().required().label("reservation"),
    cardDetails: Joi.object({
        cardNumber: Joi.string().required().label('cardNumber'),
        cardExpiry: Joi.string().required().label('cardExpiry'),
        CVV: Joi.string().required().label("CVV")
    }).required().label('cardDetails'),
    isAcceptCancellation: Joi.boolean().label("is Accept Cancellation")
})


export const cancellation_reservation = Joi.object({
    reservationId: Joi.number().required().label("reservation"),
    cancel: Joi.boolean().label("cancel")
})

