import express from 'express'
import userControllerObj from '../controllers/user.controller.js'
import { authorize } from '../helper/auth.js'
import FaqCategoryControllerObj from '../controllers/faqCategory.js'
const faqCategoryRoutes = express.Router()


faqCategoryRoutes.post("/add", FaqCategoryControllerObj.add)
// faqCategoryRoutes.post("/login", userControllerObj.login)



export default faqCategoryRoutes