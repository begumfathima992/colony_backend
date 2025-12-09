import express from 'express'
import { authorize } from '../helper/auth.js'
import CardDetailControllerObj from '../controllers/cardDetails.js'

const cardDetailRoutes = express.Router()

cardDetailRoutes.post("/add", authorize, CardDetailControllerObj.add)
cardDetailRoutes.get("/get", authorize, CardDetailControllerObj.get)
cardDetailRoutes.patch("/edit", authorize, CardDetailControllerObj.update)
cardDetailRoutes.delete("/delete", authorize, CardDetailControllerObj.delete)
export default cardDetailRoutes