import express from "express";

import * as feedbacksController from "./../controllers/feedbacks.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const feedbacksRouter = express.Router()

feedbacksRouter.post("/", feedbacksController.addFeedback)
feedbacksRouter.delete("/:id", authMiddleware, roleMiddleware("website_admin"), feedbacksController.deleteFeedback)
feedbacksRouter.get("/", authMiddleware, roleMiddleware("website_admin"), feedbacksController.showAllFeedbacks)
feedbacksRouter.get("/:id", authMiddleware, roleMiddleware("website_admin"), feedbacksController.showFeedback)
feedbacksRouter.patch("/:id", authMiddleware, roleMiddleware("website_admin"), feedbacksController.updateFeedback)

export default feedbacksRouter