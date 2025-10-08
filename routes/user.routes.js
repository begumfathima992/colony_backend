import express from 'express'
import userControllerObj from '../controllers/user.controller.js'
import { authorize } from '../helper/auth.js'
const userRoutes = express.Router()

userRoutes.post("/register", userControllerObj.register)
userRoutes.post("/login", userControllerObj.login)
userRoutes.post("/logout",authorize, userControllerObj.logout)
userRoutes.put("/change_password",authorize, userControllerObj.change_password)
export default userRoutes