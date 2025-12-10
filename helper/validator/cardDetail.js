import Joi from "joi";

export const cardDetailSchema = Joi.object({
    CVV: Joi.number().required().label("CVV"),
    cardExpiry: Joi.string().required().label("card Expiry"),
    cardNumber: Joi.number().required().label("card number")
}).required().label("data")


export const cardDetailEditSchema = Joi.object({
    id: Joi.number().required().label("id"),
    CVV: Joi.number().optional().label("CVV"),
    cardExpiry: Joi.string().optional().label("card Expiry"),
    cardNumber: Joi.number().optional().label("card number")
})

export const cardDeleteSchema = Joi.object({
    id: Joi.number().required().label("id"),
})


