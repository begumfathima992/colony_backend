import { encryptStringWithKey, generateAccessToken } from "../helper/extra.js";
import userModel from "../models/user.js";
let salt = 10
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Op } from "sequelize";


class UserService {
    async regsiter(req, res) {
        try {
            let { name, email, anniversary_date, birthday_date, password, phone } = req.body
            // console.log(req.body, 'req.bodyyyyyyy')

            let findPhoneExist = await userModel.findOne({ where: { email }, raw: true, attributes: ['id'] })
            // console.log(findPhoneExist, 'findPhoneExistfindPhoneExist')

            if (findPhoneExist && findPhoneExist?.id) {
                return res.status(400).json({ message: `This Email : ${email} is already register, kindly login your account`, statusCode: 400, success: false })
            }

            // fetch last membership_number
            let lastUser = await userModel.findOne({
                order: [['id', 'DESC']],
                raw: true,
                attributes: ['id', 'membership_number']
            });

            let newMemberId;
            if (lastUser && lastUser.id) {
                newMemberId = String(Number(lastUser.membership_number) + 1);
            } else {
                newMemberId = "20070040801"; // first record
            }

            // password = await encryptStringWithKey((Math.round(Math.random() * 40000780) + shop_name).toLowerCase());
            // password = temp_p?.slice(0, 6)

            let encrypt = await bcrypt.hash(password, salt);

            let obj = {
                name, email, password: encrypt, membership_number: newMemberId, anniversary_date, birthday_date, phone
            }
            await userModel.create(obj)
            let responseObj = {
                memberShipNumber: newMemberId
            }
            return res.status(201).json({ message: "Register success", data: responseObj, statusCode: 201, success: true })
        } catch (error) {
            console.log(error, "eororrororo")
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    // generateAccessTok
    async login(req, res) {
        try {
            let { email, password } = req.body// here we got 'membership number' or 'email' in email key 

            let find = await userModel.findOne({
                where: {
                    [Op.or]: [{ email }, { membership_number: email }]
                },
                raw: true
            })
            // console.log(find, "findEmailfindEmail")

            if (!find) {
                return res.status(400).json({ message: "User not found, kindly register first", success: false, statusCode: 400 })
            }
            // console.log(find, "findemali")
            let checkpassword = await bcrypt.compare(password, find?.password);
            // console.log(checkpassword, "checkpassword ")

            if (!checkpassword) {
                res.status(400).json({ message: "Password is not valid", success: false, statusCode: 400 })
                return;
            }

            delete find.password
            delete find.access_token
            let generateToken = generateAccessToken(find)
            let access_token = generateAccessToken(find)

            await userModel?.update({ access_token: access_token }, { where: { id: find?.id } })

            find.token = generateToken
            find.access_token = access_token

            return res.status(200).json({ message: "Login Success", data: find, statusCode: 200, success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    async logout(req, res) {
        try {
            let user_obj = req.userData
            let findUSer = await userModel?.findOne({ where: { id: user_obj?.id } })
            if (!findUSer) {
                return res.status(400).json({ message: "user not found", statusCode: 400, success: false })
            }
            await userModel?.update({ access_token: null }, { where: { id: user_obj?.id } })
            return res.status(200).json({ message: "logout success", statusCode: 200, success: true })
        }
        catch (error) {
            console.log(error, "errorerror")
            return res.status(500).json({ message: error?.message })
        }
    }

    async change_password(req, res) {
        try {
            let token_user = req.userData
            let { current_password, new_password, confirm_password } = req.body

            let fetch = await userModel?.findOne({ where: { id: token_user?.id }, raw: true, attributes: ['id', 'password'] })
            let checkpassword = await bcrypt.compare(current_password, fetch?.password);
            // console.log(checkpassword, "checkpassword ", fetch, token_user)

            if (!checkpassword) {
                res.status(400).json({ message: "Current Password is not valid", success: false, statusCode: 400 })
                return;
            } else if (new_password != confirm_password) {
                res.status(400).json({ message: "New Password And Confirm Password Must Be Same", success: false, statusCode: 400 })
                return;
            } else if (current_password?.trim() == new_password?.trim()) {
                res.status(400).json({ message: "Current Password And New Password Must Be Different", success: false, statusCode: 400 })
                return;
            }

            let encrypt = await bcrypt.hash(new_password, salt);
            await userModel?.update({ password: encrypt }, { where: { id: fetch?.id } })
            return res.status(200).json({ message: "Password change success", statusCode: 200, success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
}
const userServiceObj = new UserService()

export default userServiceObj