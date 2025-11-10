import { eventSchema } from "../helper/validator/event.js";
import eventServiceObj from "../services/event.js";

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

class EventController {
    async add(req, res) {
        try {
            let { error } = eventSchema.validate(req.body, options)
            if (error) {
                return res.status(400).json({ message: error?.details[0]?.message, statusCode: 400, success: false })
            }
            eventServiceObj.createEvent(req, res)

        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }

    async get(req, res) {
        try {
            eventServiceObj.get(req, res)

        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500, success: false })
        }
    }
}
const EventControllerObj = new EventController()

export default EventControllerObj