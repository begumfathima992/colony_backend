import EventControllerObj from "../controllers/event.js";

import express from 'express'
import { authorize, authorize_optional } from '../helper/auth.js'

const EventRoutes = express.Router()

EventRoutes.post('/add', authorize, EventControllerObj.add)
EventRoutes.get('/get', authorize, EventControllerObj.get)
export default EventRoutes