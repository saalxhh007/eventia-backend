import express from "express";
import * as statsController from "./../controllers/stats.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const statsRouter = express.Router()

// statsRouter.get("/", statsController.statesRepartition)
// reviewsRouter.get("/", statsController.recentLocations)
statsRouter.get("/total-earnings", authMiddleware, roleMiddleware("website_admin"), statsController.totalEarnings)
statsRouter.get("/average-month-earnings", authMiddleware, roleMiddleware("website_admin"), statsController.averageMonthEarnings)
statsRouter.get("/last-month-earnings", authMiddleware, roleMiddleware("website_admin"), statsController.lastMonthEarnings)
statsRouter.get("/total-users", authMiddleware, roleMiddleware("website_admin"), statsController.totalUsers)
statsRouter.get("/active-venues", authMiddleware, roleMiddleware("website_admin"), statsController.activeVenues)
statsRouter.get("/avg-users-spent", authMiddleware, roleMiddleware("website_admin"), statsController.avgUsersSpent)
statsRouter.get("/top-venues", authMiddleware, roleMiddleware("website_admin"), statsController.topVenues)

statsRouter.get("/most-popular", statsController.popularPlaces)
statsRouter.post("/log-most-popular", statsController.logPlaceVisited)

export default statsRouter