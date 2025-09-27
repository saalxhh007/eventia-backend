import path from "path"
import * as venueImagesService from "./../../services/VenueServices/venues.images.service.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const addImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const id = req.params.id
        const image = await venueImagesService.addImage(Number(id), req.file)
        return res.json(image)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteImage = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await venueImagesService.deleteImage(id)
        return res.json(deleted)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getImages = async (req, res) => {
  try {
    const id = req.user.id
    const images = await venueImagesService.getImages(id)

    let filePaths = []

    images.forEach((image) => {
      filePaths.push(path.resolve(image.image_url))
    })

    res.setHeader("Content-Type", "application/json")
    return res.json({
      images,
    })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export const updateImage = async (req, res) => {
    try {
        const id = req.params.id
        const { updatedData } = req.body
        const updated = await venueImagesService.updateImage(id, updatedData)
        return res.json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const listLocationImages = async (req, res) => {
    try {
        const id = req.params.id
        const images = await venueImagesService.listLocationImages(id)
        return res.json(images)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
