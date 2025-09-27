import { signUp } from "../UserServices/auth.service.js"
import prisma from "./../../prisma/client.js"

export const addVenue = async (Data, AdminData, file) => {
    try {
        const admin = await createWebsiteAdmin(AdminData, file)
        const venue = await prisma.venues.create({
            data: {
                name: Data.name,
                description: Data.description,
                category: Data.category,
                address: Data.address,
                state: Data.state,
                district: Data.district,
                municipality: Data.municipality,
                capacity: Number(Data.capacity),
                price: Number(Data.price),
                amenities: Data.amenities || {},
                is_active: false,
                is_available: false,
                admin_id: admin.id,
            },
        })
        return { venue, admin }
    } catch (error) {
        throw error
    }
}

export const getCommisionReport = async (id) => {
    try {
        const venue = prisma.venues.findUnique({ where: { id } })
        if (!venue) throw new Error("Venue not found")
    
        const commissionRate = 0.1
        const commission = venue.price * commissionRate

        return {
            venueId: venue.id,
            name: venue.name,
            price: venue.price,
            commission,
        }
    } catch (error) {
        throw error
    }
}

export const createPromoCodes = async (promoCodeData, id) => {
    try {
        const promoCode = await prisma.promoCode.create({
            data: {
                code: promoCodeData.code,
                discountPercentage: promoCodeData.discountPercentage,
                venue_id: promoCodeData.venue_id,
                admin_id: id,
                validTill: promoCodeData.validTill,
            },
        })
        return promoCode
    } catch (error) {
        throw error
    }
}

export const makeDiscount = async (discountData, admin_id) => {
    try {
        const updatedVenues = await prisma.venues.updateMany({
            where: { admin_id },
            data: {
                price: {
                    multiply: (100 - discountData.percentage) / 100,
                }
            }
        })
        return updatedVenues
    } catch (error) {
        throw error
    }
}


export const getEarnings = async (id) => { 
    try {
        const venues = await prisma.venues.findMany({
            where: { admin_id: id, is_active: true },
        })
    
        const totalEarnings = venues.reduce((sum, v) => sum + v.price, 0)
    
        return {
            adminId: id,
            totalVenues: venues.length,
            totalEarnings,
        }
    } catch (error) {
        throw error
    }
}

export const getMyVenue = async (id) => {
    try {
        const venue = await prisma.venues.findMany({
            where: { admin_id: id },
            include: {
                bookings: {
                    select: {
                        event_date: true
                    }
                }
            }
        })
        return venue
    } catch (error) {
        throw error
    }
}

const createWebsiteAdmin = async (AdminData, file) => {
    try {
        const admin_data = {
            ...AdminData,
            full_name: AdminData.fullName,
            date_of_birth: AdminData.DateOfBirth
        }

        delete admin_data.fullName
        delete admin_data.dateOfBirth

        const admin = await signUp(admin_data, file, true)
        const locationAdmin = await prisma.users.findUnique({
            where: { id: admin.id }
        })

        await prisma.users.update({
            where: { id: admin.id},
            data: { role: "location_admin" },
        })
        return locationAdmin
    } catch (error) {
        throw error
    }
}