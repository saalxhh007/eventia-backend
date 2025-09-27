import multer from "multer";
import prisma from "../prisma/client.js";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const venueId = req.params.id
            if (!venueId) return cb(new Error("Venue ID is required"), null)

            const venue = await prisma.venues.findUnique({
                where: { id: parseInt(venueId) },
                select: { name: true },
            })
            
            if (!venue) return cb(new Error("Venue not found"), null)

            const folderName = venue.name.toLowerCase().replace(/\s+/g, "-")
            const uploadPath = path.join("uploads", "venues", folderName)

            fs.mkdirSync(uploadPath, { recursive: true })
            cb(null, uploadPath)
        } catch (err) {
            cb(err, null)
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext)
    },
})

export const uploadLocationImages = multer({ storage })