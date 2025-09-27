import express from "express";
import * as usersController from "./../../controllers/userControllers/user.controller.js"
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const usersRouter = express.Router()

usersRouter.use(authMiddleware)
usersRouter.use(roleMiddleware("website_admin"))

// usersRouter.post("/add/customer", usersController.addUser("customer"))
// usersRouter.post("/add/location-admin", usersController.addUser("location_admin"))
usersRouter.patch("/:id", usersController.updateUser)
usersRouter.delete("/:id", usersController.deleteUser)
usersRouter.get("/", usersController.showAllUsers)
usersRouter.get("/:id", usersController.showUser)
usersRouter.post("/banned-user/:id", usersController.blockUser)
usersRouter.post("/active-user/:id", usersController.unblockUser)
usersRouter.get("/get/customers", usersController.allCustomers)
usersRouter.get("/get/venue-admins", usersController.allVenueAdmins)

export default usersRouter