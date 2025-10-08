import express from 'express'
import userControllerObj from '../controllers/user.controller.js'
import { authorize } from '../helper/auth.js'
import FaqCategoryControllerObj from '../controllers/faqCategory.js'
import FaqQuestionAnswwerControllerObj from '../controllers/faqQuestionAnswer.js'
const faqQuestionAnswerRoutes = express.Router()


faqQuestionAnswerRoutes.post("/add", FaqQuestionAnswwerControllerObj.add)
faqQuestionAnswerRoutes.get("/get", FaqQuestionAnswwerControllerObj.get)



export default faqQuestionAnswerRoutes