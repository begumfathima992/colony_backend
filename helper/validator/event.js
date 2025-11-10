import Joi from "joi";

export const eventSchema = Joi.object({
    name: Joi.string().max(500).required().optional().label("name"),
    mobile: Joi.string().optional().label("mobile"),
    eventDate: Joi.string().required().label("eventDate"),
    note: Joi.string().required().label("note"),
})


