import express from 'express'
import userControllerObj from '../controllers/user.js'
import { authorize } from '../helper/auth.js'
const userRoutes = express.Router()

userRoutes.post("/register", userControllerObj.register)
userRoutes.post("/login", userControllerObj.login)
userRoutes.post("/logout", authorize, userControllerObj.logout)
userRoutes.post("/send-otp", userControllerObj.send_otp)
userRoutes.post("/verify-otp", userControllerObj.verify_otp)


userRoutes.put("/change_password", authorize, userControllerObj.change_password)

userRoutes.put("/edit_profile", authorize, userControllerObj.edit_profile)
userRoutes.get("/get_profile", authorize, userControllerObj.get_profile)


export default userRoutes