import { cardDeleteSchema, cardDetailEditSchema, cardDetailSchema } from "../helper/validator/cardDetail.js"
import cardDetailsObj from "../services/cardDetails.js"

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

class CardDetailController {
    async add(req, res) {
        console.log(req.body,"====>card cont")
        try {
            // let { error } = cardDetailSchema.validate(req.body, options)
            // console.log(error,"card error===>>")
            // if (error) {

            //     return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            // }
            await cardDetailsObj.add(req, res)
        } catch (error) {

            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async get(req, res) {
        try {
            await cardDetailsObj.get(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async update(req, res) {
        try {
            let { error } = cardDetailEditSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            await cardDetailsObj.update(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async delete(req, res) {
        try {
            let { error } = cardDeleteSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            await cardDetailsObj.delete(req, res)
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
}
const CardDetailControllerObj = new CardDetailController()

export default CardDetailControllerObj