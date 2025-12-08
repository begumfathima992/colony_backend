import cardDetailModel from "../models/cardDetails";

class cardDetails {
    async add(req, res) {
        try {
            let { CVV, cardExpiry, cardNumber } = req.body
            let userObj = req.userData
            let obj = {
                user_id: userObj?.id, CVV, cardExpiry, cardNumber
            }
            await cardDetailModel?.create(obj)
            res.status(201).json({ message: "Add Success", data: obj, success: true })
            return
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
    async get(req, res) {
        try {
            let userObj = req.userData
            let get = await cardDetailModel?.findAll({ where: { user_id: userObj?.id }, raw: true })
            return res.status(200).json({ message: "Fetch data", data: get })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500 })
        }
    }
    async update(req, res) {
        try {
            let userObj = req.userData
            let { id, CVV, cardExpiry, cardNumber } = req.body

            let get = await cardDetailModel?.findOne({ where: { id: id, user_id: userObj?.id }, raw: true })
            if (!get) {
                return res.status(404).json({ message: "Data not found", statusCode: 404, success: false })
            }
            let obj = {
                CVV: CVV || get?.CVV,
                cardExpiry: cardExpiry || get?.cardExpiry,
                cardNumber: cardNumber || get?.cardNumber
            }
            await cardDetailModel?.update(obj, { where: { id } })
            return res.status(200).json({ message: "Data update success", data: obj, success: true })

        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500 })
        }
    }

    async delete(req, res) {
        try {
            let userObj = req.userData
            let { id } = req.body

            let get = await cardDetailModel?.findOne({ where: { id: id, user_id: userObj?.id }, raw: true })
            if (!get) {
                return res.status(404).json({ message: "Data not found or deleted", statusCode: 404, success: false })
            }
            await cardDetailModel?.delete({ where: { id } })
            return res.status(200).json({ message: "Data delete", success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500 })
        }
    }
}
const cardDetailsObj = new cardDetails
export default cardDetailsObj