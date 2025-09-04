import Joi from "joi";

export const FaqQuestionAnswerSchema = Joi.object({
    category_id: Joi.string().trim().required().label("category"),
    question: Joi.string().trim().min(3).max(400).required().label("question"),
    answer: Joi.string().trim().min(3).max(2900).optional().label("answer"),
}).required().min(1).label("Data")

