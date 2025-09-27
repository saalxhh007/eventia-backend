import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import * as venuesController from "./../../controllers/venuesController/venues.admin.controller.js"
import * as venuesAdminController from "./../../controllers/venuesController/venues.location.admin.controller.js"
import * as venuesCustomerController from "./../../controllers/venuesController/venue.customer.controller.js"
import { venuesValidation } from "./../../middlewares/validators/venue.validator.js"
import validate from "./../../middlewares/validators/validator.js";
import { uploadAvatar } from "../../multer/user_avatar.js";
import { parseFormData } from "../../helpers/parsedFormData.js";

const venuesRouter = express.Router()

venuesRouter.post("/", uploadAvatar.single("avatar"), parseFormData, venuesValidation, validate,
    venuesAdminController.addVenue)
venuesRouter.get("/", venuesController.getAllVenues)
venuesRouter.get("/:id", venuesController.getVenue)

// website admin routers
venuesRouter.patch("/:id", authMiddleware, roleMiddleware("website_admin"), venuesController.updateVenue)
venuesRouter.delete("/:id", authMiddleware, roleMiddleware("website_admin"), venuesController.deleteVenue)
venuesRouter.post("/activate/:id", authMiddleware, roleMiddleware("website_admin"), venuesController.activateVenue)
venuesRouter.post("/available/:id", authMiddleware, roleMiddleware("website_admin"), venuesController.availableVenue)

// location admin routers
venuesRouter.get("/get/my-venue", authMiddleware, roleMiddleware("location_admin"), venuesAdminController.getMyVenue)
venuesRouter.get("/get/commision-report", authMiddleware, roleMiddleware("location_admin"), venuesAdminController.getCommisionReport)
venuesRouter.post("/make/promo-codes", authMiddleware, roleMiddleware("location_admin"), venuesAdminController.createPromoCodes) //
venuesRouter.post("/make/discount", authMiddleware, roleMiddleware("location_admin"), venuesAdminController.makeDiscount) 
venuesRouter.get("/get/earnings", authMiddleware, roleMiddleware("location_admin"), venuesAdminController.getEarnings)

// customer
venuesRouter.get("/get/venues-suggestions", authMiddleware, roleMiddleware("customer"), venuesCustomerController.venuesSuggestions)
export default venuesRouter