import Joi from "joi";
import userServiceObj from "../services/user.services.js";
import moment from 'moment'
import { change_password_schema, UserLoginSchema, UserSchema, SendOtpSchema, VerifyOtpSchema } from "../helper/validator/user.validator.js";
import userModel from "../models/user.model.js";

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
            userServiceObj.change_password(req, res)
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
            console.log(req.body, "req======>")
            const { error } = SendOtpSchema.validate(req.body, options);
            console.log(error, "erroooooor")
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

    async edit_profile(req, res) {
        try {
            // const { error } = VerifyOtpSchema.validate(req.body);
            // if (error) {
            //     return res.status(400).json({
            //         success: false,
            //         message: error.details[0].message,
            //     });
            // }
            await userServiceObj.edit_profile(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

  ///////////STAFF CODE
    async staffRegister(req, res) {
        try {
            let { error } = UserSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            await userServiceObj.staffRegister(req, res)}
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }}
    async get_profile(req, res) {
        try {
            await userServiceObj.get_profile(req, res)
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
    ///////CALCULATE LOYALTY
    async addLoyaltyVisit(req, res) {
    try {
        // membership_number matches the column in your User model
        const { membership_number, amountSpent } = req.body;

        // 1. Validation
        if (!amountSpent || amountSpent <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount entered." });
        }

        // 2. Point Calculation Logic (1 point for every £10 spent)
        // Adjust the multiplier as per your restaurant policy
        const pointsEarned = Math.floor(amountSpent * 0.10); 

        // 3. Find the User in the Database
        const user = await userModel.findOne({ where: { membership_number: membership_number } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }

        // 4. Update the User using Sequelize Increment
        // This ensures the math happens safely in the database
        await user.increment({
            total_spent: amountSpent,
            loyalty_points: pointsEarned
        });

        // Reload to get the newest values after incrementing
        await user.reload();

        // 5. Success Response
        res.status(200).json({
            success: true,
            message: "Loyalty points credited successfully!",
            data: {
                customerName: user.name,
                membership_number: user.membership_number,
                pointsEarned: pointsEarned,
                currentTotalPoints: user.loyalty_points,
                lifetimeSpend: user.total_spent
            }
        });

    } catch (error) {
        console.error("Loyalty Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


async getLoyaltyStatus  (req, res)  {
  try {
    const { userId } = req.params;

    // Fetch user and only select relevant fields for security
    const user = await userModel.findByPk(userId, {
      attributes: ['id', 'name', 'loyalty_points', 'total_spent', 'membership_number']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        membershipNumber: user.membership_number,
        currentPoints: user.loyalty_points,
        totalInvested: user.total_spent,
        // Optional: Add a tier logic based on points
        tier: user.loyalty_points > 500 ? 'Gold' : 'Silver'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving loyalty data', error: error.message });
  }
};




}
const userControllerObj = new userController()

export default userControllerObj