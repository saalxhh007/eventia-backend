import express from "express";
import * as authController from "./../../controllers/userControllers/auth.controller.js"
import { signupValidation } from "./../../middlewares/validators/signup.validator.js";
import { loginValidation } from "./../../middlewares/validators/login.validator.js";
import validate from "./../../middlewares/validators/validator.js";
import authMiddleware from "./../../middlewares/auth.middleware.js";
import { uploadAvatar } from "./../../multer/user_avatar.js"
import passport from "./../../config/passport.js";

const authRouter = express.Router()

authRouter.post("/sign-up", uploadAvatar.single("avatar"), signupValidation, validate, authController.signUp)
authRouter.post("/login", loginValidation, validate, authController.login)
authRouter.post("/logout", authMiddleware, authController.logout)
authRouter.post("/refresh-token", authController.refreshToken) 
authRouter.get("/verify-email", authController.verifyEmail)

authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" }))
authRouter.get("/oauth/callback/google", 
  passport.authenticate("google", { session: false }), 
  authController.oauthController.oauthCallback
)

authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }))
authRouter.get("/oauth/callback/facebook", 
  passport.authenticate("facebook", { session: false }), 
  authController.oauthController.oauthCallback
)

export default authRouter