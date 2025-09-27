import { PrismaClient } from "./generated/prisma/client.js"
import authRouter from "./routes/userRouters/auth.router.js";
import usersRouter from "./routes/userRouters/users.router.js";
import profileRouter from "./routes/userRouters/profile.router.js";
import venuesRouter from "./routes/venuesRouters/venues.router.js";
import imagesRouter from "./routes/venuesRouters/venue.images.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import reviewsRouter from "./routes/reviews.router.js";
import complaintsRouter from "./routes/complaints.router.js";
import feedbacksRouter  from "./routes/feedbacks.router.js";
import statsRouter  from "./routes/stats.router.js";

import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(process.cwd(), "uploads/")))
const prisma = new PrismaClient()

// Routes Definition
// User Routers
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/users", usersRouter)
// Venues Routes
app.use("/api/v1/venues", venuesRouter)
app.use("/api/v1/venue-images", imagesRouter)
//
app.use("/api/v1/bookings", bookingsRouter)
app.use("/api/v1/reviews", reviewsRouter)
app.use("/api/v1/complaints", complaintsRouter)
app.use("/api/v1/feedbacks", feedbacksRouter)
app.use("/api/v1/stats", statsRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  try {
    await prisma.$connect()
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`)
  } catch (error) {
    console.error("❌ Database connection failed:", error)
  }
})
