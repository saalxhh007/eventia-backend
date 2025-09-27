import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import * as profileController from "./../../controllers/userControllers/profile.controller.js"
import validate from "../../middlewares/validators/validator.js";
import { passwordValidation } from "../../middlewares/validators/password.validator.js";
import { uploadAvatar } from "../../multer/user_avatar.js";

const profileRouter = express.Router()

profileRouter.patch("/",
    authMiddleware, roleMiddleware("customer"), profileController.updateProfile)
profileRouter.patch("/update/password",
    authMiddleware, roleMiddleware("customer"), passwordValidation, validate, profileController.updatePassword)
// password restoration
profileRouter.post("/forget-password", profileController.forgetPassword)
profileRouter.post("/restore-password", profileController.restorePassword)
// end
profileRouter.get("/", authMiddleware, roleMiddleware("customer"), profileController.getMyProfile)
profileRouter.patch("/update-my-avatar", authMiddleware, roleMiddleware("customer"), uploadAvatar.single("avatar"), profileController.updateProfilePic)
profileRouter.delete("/delete-profile", authMiddleware, roleMiddleware("customer"), profileController.deleteMyProfile)

export default profileRouter