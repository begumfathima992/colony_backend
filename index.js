import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import { environmentVar } from './config/environmentVariable.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import WishlistRoutes from './routes/wishlist.js'
import BrandRoutes from './routes/brand.js'
import faqCategoryRoutes from './routes/faqCategory.js'
import faqQuestionAnswerRoutes from './routes/faqQuestionAnswer.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/hellow", (req, res) => {
    return res.status(200).json({ message: "success message" })
})

app.use("/user", userRoutes)
app.use("/faq_category", faqCategoryRoutes)
app.use("/faq_question_answer", faqQuestionAnswerRoutes)


app.use("/product", productRoutes)
app.use("/cart", cartRoutes)
app.use("/wishlist", WishlistRoutes)
app.use("/brands", BrandRoutes)


app.listen(environmentVar.PORT, (res, err) => {
    console.log(`success listening to port : ${environmentVar.PORT}`)
})
