import express from "express";

import * as reviewsController from "./../controllers/reviews.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { uploadReviewImage } from "../multer/review_image.js";

const reviewsRouter = express.Router()

reviewsRouter.post("/:location_id", authMiddleware, roleMiddleware("customer"), uploadReviewImage.single("image"), reviewsController.addReview)
reviewsRouter.delete("/:review_id", authMiddleware, roleMiddleware("customer", "website_admin"), reviewsController.deleteReview)
reviewsRouter.patch("/:location_id", authMiddleware, roleMiddleware("customer", "website_admin"), reviewsController.updateReview)
reviewsRouter.get("/", reviewsController.showAllReviews)
reviewsRouter.get("/:id", reviewsController.showReview)
reviewsRouter.get("/location/:location_id", reviewsController.showLocationReviews)
reviewsRouter.get("/customer/:customer_id", reviewsController.showCustomerReviews)
reviewsRouter.get("/my/reviews", authMiddleware, roleMiddleware("customer"), reviewsController.showMyReviews)
reviewsRouter.get("/my/location", authMiddleware, roleMiddleware("location_admin"), reviewsController.showMyLocationReviews)

export default reviewsRouter