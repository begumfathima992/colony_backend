import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/dbconfig.js";   // Sequelize instance
import environmentVar from "./config/environmentVariables.js";
import reservationRoutes from './routes/reservation.routes.js';
import cors from 'cors';
// Routes
import userRoutes from "./routes/user.js";
import User from "./models/user.model.js";
import Reservation from "./models/reservation.model.js";
import EventRoutes from "./routes/event.js";
import EventModel from "./models/event.js";
import cardDetailRoutes from "./routes/cardDetails.routes.js";
import cardDetailModel from "./models/cardDetails.js";
// import faqCategoryRoutes from "./routes/faqCategory.js";
// import faqQuestionAnswerRoutes from "./routes/faqQuestionAnswer.js";

// Load environment variables
dotenv.config();


// Initialize app
const app = express();
app.use(cors({
  origin: '*', // React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "✅ Server is healthy" });
});

// Main routes
app.use("/user", userRoutes);
app.use('/reservations', reservationRoutes);
app.use("/event", EventRoutes);
app.use("/card_detail", cardDetailRoutes)
// app.use("/faq_question_answer", faqQuestionAnswerRoutes);

// Default fallback route (404 handler)
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// Start server after DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true }); // create/update tables if needed
    console.log("✅ Tables synced");

    const PORT = environmentVar.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database error:", err);
  }
})();

async function sol() {
  let carddetails =[]
   carddetails =await cardDetailModel?.findAll({where:{user_id:"29"},
    raw: true
  })
  let findd2 = await Reservation?.findAll({
    //  where:     { name: "aone" },
    raw: true,
    //  attributes: ['id', 'membership_number', 'phone', 'name']
  })
  for (let le of carddetails) {
    await reservations?.destroy({ where: { id: le.id } })
    // await User.update({is_phone_verify:true},{where:{id:le?.id}})
  }
  console.log("findd2", "eeeeeeeee/eee", carddetails, "------->>>>>>carddetails")
  // let findd =await Reservation?.findAll( {where:{user_id:findd2[0].id}, raw:true})
  // let findd = await Reservation?.findOne({ where: { id: 26 }, raw: true })
  // let findd = await Reservation?.findAll({ raw: true })
  // console.log(findd, 'findnddn')
  // let get=await EventModel?.findAll({raw:true})
  // console.log(get,"getgetg")
}
// sol()
