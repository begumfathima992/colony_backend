import Joi from "joi";

export const FaqCategorySchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().label("name"),
    description: Joi.string().trim().min(3).max(900).optional().label("description"),
}).required().min(1).label("Data")

