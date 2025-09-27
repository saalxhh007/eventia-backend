import express from "express";

import * as bookingsController from "./../controllers/bookings.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const bookingsRouter = express.Router()

bookingsRouter.get("/", bookingsController.allBookings)
bookingsRouter.post("/", authMiddleware, roleMiddleware("customer", "website_admin"), bookingsController.addBooking)
bookingsRouter.delete("/:id",
    authMiddleware, roleMiddleware("location_admin", "website_admin"), bookingsController.deleteBooking)
bookingsRouter.patch("/:id", authMiddleware, roleMiddleware("location_admin", "website_admin"), bookingsController.modifyBooking)
bookingsRouter.get("/venue/upcoming-bookings", authMiddleware, roleMiddleware("location_admin"), bookingsController.myVenueBookings)
bookingsRouter.patch("/venue-res/:id/", authMiddleware, roleMiddleware("location_admin", "website_admin"), bookingsController.manageReqs)
bookingsRouter.get("/my/bookings", authMiddleware, roleMiddleware("customer"), bookingsController.myBookings)
bookingsRouter.post("/my/bookings-cancel/:id", authMiddleware, roleMiddleware("customer"), bookingsController.cancellationReq)
bookingsRouter.get("/my/bookings-results", authMiddleware, roleMiddleware("customer"), bookingsController.bookingResult)

export default bookingsRouter