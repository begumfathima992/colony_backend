import Joi from "joi";

export const UserSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().label("name"),
    password: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "password rules")
        .required()
        .label("password"),
    email: Joi.string().trim().max(86).required().email({ tlds: { allow: false } }).label("email"),
}).required().min(1).label("Data")


export const USerLoginSchema = Joi.object({
    email: Joi.string().trim().max(56).required()
    // .email({ tlds: { allow: false } })
    .label("Email or Membership Number"),
    password: Joi.string()
        .trim().
        min(3).max(70)
        .required()
        .label('password')
}).required().min(1).label("Data");

