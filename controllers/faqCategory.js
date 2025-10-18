// import Joi from "joi";
// import userServiceObj from "../services/user.services.js";
// import moment from 'moment'
// import { FaqCategorySchema } from "../helper/validator/faqCategory.js";
// import faqCategoryService from "../services/faqCategory.js";
// import faqCategoryServiceObj from "../services/faqCategory.js";


// const options = {
//     abortEarly: false,
//     allowUnknown: true,
//     stripUnknown: true
// }

// class FaqCategoryController {
//     async add(req, res) {
//         try {
//             let { error } = FaqCategorySchema.validate(req.body, options)
//             if (error) {
//                 return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
//             }
//             faqCategoryServiceObj.add(req, res)
//         } catch (error) {
//             return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
//         }
//     }


// }
// const FaqCategoryControllerObj = new FaqCategoryController()

// export default FaqCategoryControllerObj