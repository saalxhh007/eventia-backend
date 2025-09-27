import express from "express";

import * as complaintsController from "./../controllers/complaints.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const complaintsRouter = express.Router()

complaintsRouter.post("/", authMiddleware, roleMiddleware("customer"), complaintsController.addComplaint)
complaintsRouter.delete("/:id", authMiddleware, roleMiddleware("customer", "website_admin"), complaintsController.deleteComplaint)
complaintsRouter.get("/", authMiddleware, roleMiddleware("location_admin", "website_admin"), complaintsController.showAllComplaints)
complaintsRouter.get("/:id", authMiddleware, roleMiddleware("location_admin", "website_admin"), complaintsController.showComplaint)
complaintsRouter.patch("/:id", authMiddleware, roleMiddleware("customer", "website_admin"), complaintsController.updateComplaint)
complaintsRouter.get("/location/:id", authMiddleware, roleMiddleware("location_admin", "website_admin"), complaintsController.showLocationComplaint) //
complaintsRouter.get("/customer/:id", authMiddleware, roleMiddleware("location_admin", "website_admin"), complaintsController.ShowCustomerComplaint) //
complaintsRouter.get("/my/complaints", authMiddleware, roleMiddleware("customer"), complaintsController.ShowMyComplaints)

export default complaintsRouter