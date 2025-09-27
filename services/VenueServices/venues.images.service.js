import { deleteFile } from "../../helpers/deleteImage.js"
import prisma from "../../prisma/client.js"
import path from "path"

export const addImage = async (id, file, isCover = false) => {
  try {
    const existingCover = await prisma.images.findFirst({
      where: {
        venue_id: parseInt(id),
        is_cover: true,
      },
    })

    const shouldBeCover = !existingCover && !isCover ? true : isCover

    const relativePath = path
      .join(
        "/uploads",
        "venues",
        path.basename(path.dirname(file.path)),
        path.basename(file.path)
      )
      .replace(/\\/g, "/")

    return await prisma.images.create({
      data: {
        image_url: relativePath,
        title: file.originalname,
        is_cover: shouldBeCover,
        venue_id: parseInt(id),
      },
    })
  } catch (error) {
    throw error
  }
}

export const deleteImage = async (id) => {
    try {
        
        const image = await prisma.images.findUnique({ where: { id: parseInt(id) } })
        if (!image) throw new Error("Image not found")
        
        deleteFile(image.image_url)
        return await prisma.images.delete({
            where: { id: parseInt(id) },
        })
        
    } catch (error) {
        throw error
    }
}
export const getImages = async (id) => {
  try {
    const admin = await prisma.users.findUnique({
      where: { id: id },
      include: { venues: true },
    })

    if (!admin || admin.venues.length === 0) {
      throw new Error("User has no venues")
    }

    const venueId = admin.venues[0].id

    const images = await prisma.images.findMany({
      where: { venue_id: venueId },
    })

    return images
  } catch (error) {
    throw error
  }
}

export const updateImage = async (id, updatedData) => {
    try {
        const image = await prisma.images.findUnique({ where: { id: parseInt(id) } })
        if (!image) throw new Error("Image not found")
        
        deleteFile(image.image_url)

        return await prisma.images.update({
            where: { id: parseInt(id) },
            data: updatedData,
        })
    } catch (error) {
        throw error
    }
}

export const listLocationImages = async (id) => {
    try {
        return await prisma.images.findMany({
            where: { venue_id: parseInt(id) },
        })
    } catch (error) {
        throw error
    }
}
