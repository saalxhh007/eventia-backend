import prisma from "../../prisma/client.js";
import mailHelper from "./../../helpers/mailer.js"

export const updateVenue = async (updatedData, id) => {
  try {
    const venue = await prisma.venues.update({
      where: { id: Number(id) },
      data: updatedData,
    })
    return venue
  } catch (error) {
      throw error
  }    
}

export const deleteVenue = async (id) => {
    try {
        await prisma.venues.delete({
            where: {
                id: Number(id)
            }
        })
        return true
    } catch (error) {
        throw error
    }
}

export const getAllVenues = async () => {
    try {
        const venues = await prisma.venues.findMany()
        return venues
    } catch (error) {
        throw error
    }
}

export const getVenue = async (id) => {
    try {
        const venue = await prisma.venues.findUnique({
            where: { id: Number(id) },
            include: { images: true },
        })
        if (!venue) throw new Error("Venue not found")
        return venue
    } catch (error) {
        throw error
    }
}

export const activateVenue = async (id) => {
  try {
    const venue = await prisma.venues.update({
      where: { id: Number(id) },
      data: { is_active: true, is_available: true },
      include: { users: true },
    })

    if (!venue.users || !venue.users.email) {
      throw new Error("Venue admin email not found")
    }

    await prisma.users.update({
      where: { id: venue.admin_id },
      data: { status: "active" },
    })

    await mailHelper.sendVenueActivation(venue.users.email)

    return venue
  } catch (error) {
    throw error
  }
}

export const availableVenue = async (id) => {
    try {
        const venue = await prisma.venues.update({
            where: { id: Number(id) },
            data: { is_available: true }
        })

        return venue
    } catch (error) {
        throw error
    }
}