import Joi from "joi";
import userServiceObj from "../services/user.js";
import moment from 'moment'
import { FaqCategorySchema } from "../helper/validator/faqCategory.js";
import faqCategoryService from "../services/faqCategory.js";
import faqCategoryServiceObj from "../services/faqCategory.js";
import { FaqQuestionAnswerSchema } from "../helper/validator/faqQuestionAnswer.js";
import FaqQuestionAnswerServicesObj from "../services/faqQuestionAnswer.js";


const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

class FaqQuestionAnswwerController {
    async add(req, res) {
        try {
            let { error } = FaqQuestionAnswerSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            FaqQuestionAnswerServicesObj.add(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    async get(req, res) {
        try {
            // let { error } = FaqQuestionAnswerSchema.validate(req.body, options)
            // if (error) {
            //     return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            // }
            FaqQuestionAnswerServicesObj.get(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }


}
const FaqQuestionAnswwerControllerObj = new FaqQuestionAnswwerController()

export default FaqQuestionAnswwerControllerObj