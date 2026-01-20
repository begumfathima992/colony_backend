import { encryptStringWithKey, generateAccessToken } from "../helper/extra.js";
import userModel from "../models/user.model.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import twilio from "twilio";
import clientTwilio from "../config/twilio.js";
import User from "../models/user.model.js";

let salt = 10
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import env from "../config/environmentVariables.js";
import cardDetailModel from "../models/cardDetails.js";



const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = {};


class UserService {
  /////fathima code
  // async regsiter(req, res) {
  //     try {
  //         let { name, email, anniversary_date, birthday_date, password } = req.body
  //         // console.log(req.body,'req.bodyyyyyyy')

  //         let findPhoneExist = await userModel.findOne({ where: { email }, raw: true, attribute: ['id'] })
  //         if (findPhoneExist && findPhoneExist?.id) {
  //             return res.status(400).json({ message: `This Email : ${email} is already register, kindly login your account`, statusCode: 400, success: false })
  //         }

  //         // fetch last membership_number//////prb code
  //         // let lastUser = await userModel.findOne({
  //         //     order: [['id', 'DESC']],
  //         //     raw: true,
  //         //     attributes: ['id', 'membership_number']
  //         // });

  //         // let newMemberId;
  //         // if (lastUser && lastUser.id) {
  //         //     newMemberId = String(Number(lastUser.membership_number) + 1);
  //         // } else {
  //         //     newMemberId = "20070040801"; // first record
  //         // }
  //         //////prb code
  //         let lastUser = await userModel.findOne({
  //         order: [['id', 'DESC']],
  //         raw: true,
  //         attributes: ['id', 'membership_number']
  //     });

  //     let newMemberId;
  //     if (lastUser && lastUser.membership_number) {
  //         newMemberId = String(Number(lastUser.membership_number) + 1);
  //     } else {
  //         newMemberId = "20070040801"; // first record
  //     }

  //     // Print membership number in console
  //     console.log("Generated Membership Number:", newMemberId);

  //         // password = await encryptStringWithKey((Math.round(Math.random() * 40000780) + shop_name).toLowerCase());
  //         // password = temp_p?.slice(0, 6)

  //         let encrypt = await bcrypt.hash(password, salt);

  //         let obj = {
  //             name, email, password: encrypt, membership_number: newMemberId, anniversary_date, birthday_date,
  //         }
  //         await userModel.create(obj)
  //          let responseObj = {
  //             memberShipNumber: newMemberId
  //         }
  //         return res.status(201).json({ message: "Register success",data:responseObj, statusCode: 201, success: true })
  //     } catch (error) {
  //         console.log(error, "eororrororo")
  //         return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
  //     }
  // }

  /////////end
  async register(req, res) {
    try {
      let { name, phone, password } = req.body;
      console.log(req.body, "======>register error")

      // check if phone exists
      let findMobileExist = await userModel.findOne({
        where: { phone, is_phone_verify: true },
        raw: true,
        attributes: ["id"],
      });

      if (findMobileExist && findMobileExist?.id) {
        return res.status(400).json({
          message: `This Mobile Number : ${phone} is already registered, kindly login to your account`,
          statusCode: 400,
          success: false,
        });
      }

      // fetch last membership_number
      let lastUser = await userModel.findOne({
        order: [["id", "DESC"]],
        raw: true,
        attributes: ["id", "membership_number"],
      });

      let newMemberId;
      if (lastUser && lastUser.membership_number) {
        newMemberId = String(Number(lastUser.membership_number) + 1);
      } else {
        newMemberId = "20070040801"; // first record
      }

      // Print membership number in console
      console.log("Generated Membership Number:", newMemberId);

      // hash password
      let encrypt = await bcrypt.hash(password, salt);

      // create user
      let obj = {
        name,
        phone,
        password: encrypt,
        membership_number: newMemberId,
        is_phone_verify: false
      };

      await userModel.create(obj);

      let responseObj = {
        memberShipNumber: newMemberId,
      };

      return res.status(201).json({
        message: "Register success",
        data: responseObj,
        statusCode: 201,
        success: true,
      });
    } catch (error) {
      console.log(error, "register error");
      return res.status(500).json({
        message: error?.message,
        statusCode: 500,
        success: false,
      });
    }
  }


  // generateAccessTok
  async login(req, res) {
    try {
      let { loginField, password } = req.body; // loginField can be email or membership number

      if (!loginField || !password) {
        return res.status(400).json({
          message: "Login field and password are required",
          success: false,
          statusCode: 400
        });
      }

      // Find user by email OR membership number
      let find = await userModel.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { phone: loginField, is_phone_verify: true },
                { membership_number: loginField }
              ]
            },
            { is_phone_verify: true }
          ]
        },
        raw: true
      });

      if (!find) {
        return res.status(400).json({
          message: "User not found, kindly register first",
          success: false,
          statusCode: 400
        });
      }

      // Check password
      let checkPassword = await bcrypt.compare(password, find.password);
      if (!checkPassword) {
        return res.status(400).json({
          message: "Password is not valid",
          success: false,
          statusCode: 400
        });
      }

      // Remove sensitive info
      delete find.password;
      delete find.access_token
      // Generate token
      let access_token = generateAccessToken(find);

      // Save access token in DB
      await userModel.update({ access_token }, { where: { id: find.id } });

      find.access_token = access_token;
      //card_Details fetch 

      let fetch_card_details = await cardDetailModel?.findAll({ where: { user_id: String(find.id) }, raw: true })
      console.log(fetch_card_details, 'fetch_card_detailsfetch_card_details')
      find.card_details = fetch_card_details || []

      return res.status(200).json({
        message: "Login Success",
        data: find,
        statusCode: 200,
        success: true
      });

    } catch (error) {
      console.log(error, "www login loginnnn");
      return res.status(500).json({
        message: error?.message,
        statusCode: 500,
        success: false
      });
    }
  }


  async logout(req, res) {
    ////pbr code
    try {
      let user_obj = req.userData
      let findUSer = await userModel?.findOne({ where: { id: user_obj?.id } })
      if (!findUSer) {
        return res.status(400).json({ message: "user not found" })
      }
      await userModel?.update({ access_token: null }, { where: { id: user_obj?.id } })
      return res.status(200).json({ message: "logout success", status: 200, success: true })
    }
    catch (error) {
      console.log(error, "errorerror")
      return res.status(500).json({ message: error?.message })
    }
    /////pbr code

  }
  async change_password(req, res) {
    try {
      let token_user = req.userData
      let { current_password, new_password, confirm_password } = req.body
      let fetch = await userModel?.findOne({ where: { id: token_user?.id }, raw: true, attributes: ['id', 'password'] })



      let checkpassword = await bcrypt.compare(current_password, fetch?.password)
      if (!checkpassword) {
        res.status(400).json({ message: "current password is not valid", success: false, statusCode: 400 })
        return;
      } else if (new_password != confirm_password) {

        res.status(400).json({ message: "new password and confirm password must be same", success: false, statusCode: 400 })
        return;
      } else if (current_password?.trim() == new_password?.trim()) {
        res.status(400).json({ message: "cuu pass and new pass must not be same", success: false, statusCode: 400 })
        return;
      }
      let encrypt = await bcrypt.hash(new_password, salt);
      await userModel?.update({ password: encrypt }, { where: { id: fetch?.id } })
      return res.status(200).json({ message: "password change success", statusCode: 200, success: true })


    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })

    }
  }

  ////////otp

  // async send_otp(req, res) {
  //   try {
  //     const { phone } = req.body;

  //     const verification = await client.verify.v2
  //       .services(process.env.TWILIO_VERIFY_SID)
  //       .verifications.create({ to: phone, channel: "sms" });

  //     res.json({ success: true, status: verification.status });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }





  ///////VERIFY

  // async verify_otp(req, res) {
  //   try {
  //     const { phone, code } = req.body;

  //     const verification_check = await client.verify.v2
  //       .services(process.env.TWILIO_VERIFY_SID)
  //       .verificationChecks.create({ to: phone, code });

  //     if (verification_check.status === "approved") {
  //       res.json({ success: true, message: "✅ Phone verified successfully!" });
  //     } else {
  //       res.json({ success: false, message: "❌ Invalid OTP" });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }
  //////new verify


  /** 
   * 
   * sonu --> ke pass fatima ka nuberb usne accout create 
   * fatima ke pass , apka number hai docuent ban gya ... 
   * 
  */

  // async send_otp(req, res) {
  //   try {
  //     const { phone, membership_number } = req.body;

  //     // Generate a 6-digit OTP
  //     const otp = Math.floor(100000 + Math.random() * 900000);
  //     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins

  //     // Save OTP and expiry in DB
  //     const [updated] = await User.update(
  //       { otp, otpExpiry },
  //       { where: { phone, membership_number } }
  //     );

  //     // If user not found in DB
  //     if (updated === 0) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "User not found with this phone number" });
  //     }

  //     // ✅ Send OTP via voice call (slowly)
  //     const otpString = otp.toString().split("").join(", "); // makes it read slowly
  //     await client.calls.create({
  //       twiml: `<Response>
  //                 <Say voice="alice" rate="slow">
  //                   COLONY one time password is ${otpString}.
  //                   I repeat, COLONY one time password is ${otpString}.
  //                   Thank you.
  //                 </Say>
  //               </Response>`,
  //       to: phone,
  //       from: env.TWILIO_PHONE_NUMBER,
  //     });

  //     res.json({
  //       success: true,

  //       message: "OTP sent successfully via voice call",
  //       // otp, // 🔹 for testing — remove in production
  //     });
  //     console.log(otp, "otpotp====>")
  //   } catch (err) {
  //     console.error("Error sending OTP:", err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // }

  // =====================================================
  // VERIFY OTP
  // =====================================================

  async send_otp(req, res) {
    try {
      const { phone, membership_number } = req.body;

      if (!phone || !membership_number) {
        return res.status(400).json({
          success: false,
          message: "phone and membership_number are required",
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      const [updated] = await User.update(
        { otp, otpExpiry },
        { where: { phone, membership_number } }
      );

      if (updated === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found with this phone number",
        });
      }

      const otpString = otp.toString()?.split("")?.join(", ");

      await client.calls.create({
        twiml: `<Response>
                <Say voice="alice" rate="slow">
                  COLONY one time password is ${otpString}.
                  I repeat, COLONY one time password is ${otpString}.
                  Thank you.
                </Say>
              </Response>`,
        to: phone,
        from: env.TWILIO_PHONE_NUMBER,
      });

      res.json({
        success: true,
        message: "OTP sent successfully via voice call",
      });

    } catch (err) {
      console.error("Error sending OTP:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  async verify_otp(req, res) {
    try {
      const { phone, code, membership_number } = req.body;

      // Get user record
      const user = await User.findOne({ where: { phone, membership_number }, raw: true, order: [['id', 'DESC']] });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Check if OTP exists
      if (!user.otp) {
        return res
          .status(400)
          .json({ success: false, message: "No OTP sent to this phone" });
      }

      // Check expiry
      if (new Date() > new Date(user.otpExpiry)) {
        return res
          .status(400)
          .json({ success: false, message: "OTP has expired" });
      }

      // Compare OTP
      if (code.toString() === user.otp.toString()) {
        // Clear OTP after successful verification
        await User.update({ otp: null, otpExpiry: null, is_phone_verify: true }, { where: { phone, is_phone_verify: false, membership_number } });

        return res.json({
          success: true,
          message: "✅ Phone verified successfully!",
        });
      } else {
        return res.json({ success: false, message: "❌ Invalid OTP" });
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  ////////////
  //   async change_password(req, res) {
  //     try {
  //         let token_user = req.userData
  //         let { current_password, new_password, confirm_password } = req.body

  //         let fetch = await userModel?.findOne({ where: { id: token_user?.id }, raw: true, attributes: ['id', 'password'] })
  //         let checkpassword = await bcrypt.compare(current_password, fetch?.password);
  //         // console.log(checkpassword, "checkpassword ", fetch, token_user)

  //         if (!checkpassword) {
  //             res.status(400).json({ message: "Current Password is not valid", success: false, statusCode: 400 })
  //             return;
  //         } else if (new_password != confirm_password) {
  //             res.status(400).json({ message: "New Password And Confirm Password Must Be Same", success: false, statusCode: 400 })
  //             return;
  //         } else if (current_password?.trim() == new_password?.trim()) {
  //             res.status(400).json({ message: "Current Password And New Password Must Be Different", success: false, statusCode: 400 })
  //             return;
  //         }

  //         let encrypt = await bcrypt.hash(new_password, salt);
  //         await userModel?.update({ password: encrypt }, { where: { id: fetch?.id } })
  //         return res.status(200).json({ message: "Password change success", statusCode: 200, success: true })
  //     } catch (error) {
  //         return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
  //     }
  // }
  /////////

  async edit_profile(req, res) {
    try {
      let { name,
        phone,
        anniversary_date,
        birthday_date,
        title,
        gender,
        nationality,
        workNumber,
        homeNumber,
        addressLineOne,
        addressLinetwo,
        addressLinethree,
        city,
        country
      } = req.body

      let userData = req.userData
      let findObj = await userModel?.findOne({ where: { id: userData.id }, raw: true })

      let obj = {
        name: name || findObj?.name,
        phone: phone || findObj?.phone,
        anniversary_date: anniversary_date || findObj?.anniversary_date,
        birthday_date: birthday_date || findObj?.birthday_date,
        title: title || findObj?.title,
        gender: gender || findObj?.gender,
        nationality: nationality || findObj?.nationality,
        workNumber: workNumber || findObj?.workNumber,
        homeNumber: homeNumber || findObj?.homeNumber,
        addressLineOne: addressLineOne || findObj?.addressLineOne,
        addressLinetwo: addressLinetwo || findObj?.addressLinetwo,
        addressLinethree: addressLinethree || findObj?.addressLinethree,
        city: city || findObj?.city,
        country: country || findObj?.country
      }
      await userModel.update(obj, { where: { id: userData.id } })
      return res.status(200).json({ message: "Data updated", statusCode: 200, success: true })
    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
    }
  }
  async get_profile(req, res) {
    try {

      let userData = req.userData
      let findObj = await userModel?.findOne({ where: { id: userData.id }, raw: true })
      return res.status(200).json({ message: "Data fetched", statusCode: 200, success: true, data: findObj })

    } catch (error) {
      return res.status(500).json({ message: error?.message, statusCode: 500, success: false })

    }
  }

}
const userServiceObj = new UserService()

export default userServiceObj