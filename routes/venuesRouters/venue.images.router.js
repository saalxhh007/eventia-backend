import express from "express";

import roleMiddleware from "../../middlewares/role.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import * as venuesImagesController from "./../../controllers/venuesController/venue.images.controller.js"
import { uploadLocationImages } from "../../multer/images_table.js";

const imagesRouter = express.Router()

imagesRouter.post("/:id",
 authMiddleware, roleMiddleware("location_admin", "website_admin"), uploadLocationImages.single("image"), venuesImagesController.addImage)
imagesRouter.delete("/:id", authMiddleware, roleMiddleware("location_admin", "website_admin"), venuesImagesController.deleteImage)
imagesRouter.get("/", authMiddleware, roleMiddleware("location_admin", "website_admin"), venuesImagesController.getImages)
imagesRouter.patch("/:id", authMiddleware, roleMiddleware("website_admin"), uploadLocationImages.single("image"), venuesImagesController.updateImage)
imagesRouter.get("/:id", authMiddleware, roleMiddleware("website_admin"), venuesImagesController.listLocationImages)

export default imagesRouter