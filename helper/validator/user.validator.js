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

}).required().min(1).label("Data")


// export const USerLoginSchema = Joi.object({
//     email: Joi.string().trim().max(50).required().email({ tlds: { allow: false } }).label("email"),
//     password: Joi.string()
//         .trim().
//         min(3).max(70)
//         .required()
//         .label('password')
// }).required().min(1).label("Data");



export const UserLoginSchema = Joi.object({
  loginField: Joi.string()
    .trim()
    .required()
    .label("Email or Membership Number"), // friendly error message
  password: Joi.string()
    .trim()
    .min(3)
    .max(70)
    .required()
    .label("Password")
}).required().min(1);



// export const change_password_schema =Joi.object({
//   current_password:Joi.string().trim().min(3)
//   .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,"password rules")
//   .required().label("current_password"),
//   new_password:Joi.string().min(3).max(40).required()
//   .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,"password rules")
//   .label("new_password"),
//   confirm_password:Joi.string().min(3)
//   .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,"password rules")
//   .max(40).required().label("confirm_new_password")
// })


export const change_password_schema = Joi.object({
    current_password: Joi.string().trim().min(3)
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "password rules")
        .required().label("current_password"),
    new_password: Joi.string().min(3).max(40).required()
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "password rules")
        .label("new_password"),
    confirm_password: Joi.string().min(3)
        .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, "password rules")
        .max(40).required().label("confirm_new_password")
})

