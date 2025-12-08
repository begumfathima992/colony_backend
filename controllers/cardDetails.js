
const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

class CardDetailController {
    async get(req, res) {
        try {
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
}
const CardDetailControllerObj = new CardDetailController()

export default CardDetailControllerObj