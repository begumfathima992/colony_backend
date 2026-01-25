import Joi from "joi";
import userServiceObj from "../services/user.services.js";
import moment from 'moment'
import { change_password_schema, UserLoginSchema, UserSchema, SendOtpSchema,VerifyOtpSchema} from "../helper/validator/user.validator.js";


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
                return res.status(400).json({ message: error.details[0]?.message, statusCode: 400, success: false })
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
    async change_password(req, res) {
        try {
            let { error } = change_password_schema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error.details[0]?.message, statusCode: 400, success: false })
            }
            userServiceObj.change_password(req,res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }



//       async send_otp(req, res) {
//     try {
//       // Validate input
//     //   const { error } = SendOtpSchema.validate(req.body);
//     //   if (error) {
//     //     return res.status(400).json({
//     //       success: false,
//     //       message: error.details[0].message,
//     //     });
//     //   }

//            await userServiceObj.send_otp(req, res)
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }






  async send_otp(req, res) {
    try {
      console.log(req.body,"req======>")
      const { error } = SendOtpSchema.validate(req.body,options);
      console.log(error,"erroooooor")
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      await userServiceObj.send_otp(req, res);
    } catch (err) {
      console.error("Controller error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

    async verify_otp(req, res) {
    try {
 
      const { error } = VerifyOtpSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

           await userServiceObj.verify_otp(req, res)
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  ///////////STAFF CODE
    async staffRegister(req, res) {
        try {
            let { error } = UserSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            await userServiceObj.staffRegister(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }


    /////LOGIN
     async staffLogin(req, res) {
        try {
            // console.log("first", req.body)
            // joi validation
            let { error } = UserLoginSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error.details[0]?.message, statusCode: 400, success: false })
            }

            await userServiceObj.staffLogin(req, res)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }




}
const userControllerObj = new userController()

export default userControllerObj