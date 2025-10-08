import Joi from "joi";
import userServiceObj from "../services/user.services.js";
import moment from 'moment'
import { UserLoginSchema, UserSchema,change_password_schema } from "../helper/validator/user.validator.js";


const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

class userController {

    async register(req, res) {
        try {
            let { error } = UserSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            await userServiceObj.register(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    async login(req, res) {
        try {
            // console.log("first", req.body)
            // joi validation
            let { error } = UserLoginSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error.details[0]?.message, statusCode: 400 })
            }

            await userServiceObj.login(req, res)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async logout(req, res) {
        try {
            await userServiceObj.logout(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async change_password(req,res){
        try{
            let {error}=change_password_schema.validate(req.body,options)
            if(error){
                return res.status(400).json({message:error.details[0]?.message,statusCode:400,success:false})
            }
            userServiceObj.change_password(req,res)

        }catch(error){
            return res.status(500).json({message:error?.message,statusCode:500,success:false})

        }

    }
    //     async change_password(req, res) {
    //      try {
    //     const { error } = change_password_schema.validate(req.body, { abortEarly: true });
    //     if (error) {
    //         return res.status(400).json({ message: error.details[0].message, success: false, statusCode: 400 });
    //     }
    //     await userServiceObj.change_password(req, res);
    // } catch (error) {
    //     return res.status(500).json({ message: error.message, success: false, statusCode: 500 });
    // }
    // }
}
const userControllerObj = new userController()

export default userControllerObj