import EventModel from "../models/event.js";

class EventService {
    async createEvent(req, res) {
        try {
            let { name, mobile, eventDate, note } = req.body
            let userData = req.userData
            // let checkEventExist = await EventModel?.findOne({ where: { name: name }, raw: true, attributes: ['name', 'id'] });
            // // ek din mai five 
            // if (checkEventExist && checkEventExist?.id) {
            //     return res.status(400).json({ message: "Event already exist with this name", statusCode: 400, success: false })
            // }
            

            let obj = { name, mobile, eventDate, note, user_id: userData?.id }
            await EventModel.create(obj)
            return res.status(201).json({ message: "Generate succcess", statusCode: 201, success: true })
        } catch (error) {
            return res.status(500).json({ message: error?.message, statusCode: 500 })
        }
    }

    async get(req, res) {
        try {
            // let { name, mobile, eventDate, note } = req.body
            let userData = req.userData
            let get = await EventModel?.findAll({ where: { user_id: userData?.id?.toString() }, raw: true, order: [['id', 'DESC']] })

            return res.status(200).json({ message: "Fetch Generate ", data: get, statusCode: 200, success: true })
        } catch (error) {
            console.log(error,"eeeeeeget ")
            return res.status(500).json({ message: error?.message, statusCode: 500 })
        }
    }
}
let eventServiceObj = new EventService()

export default eventServiceObj