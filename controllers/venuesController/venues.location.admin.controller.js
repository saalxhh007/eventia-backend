import * as venuesAdminService from "./../../services/VenueServices/venues.location.admin.service.js"

export const addVenue = async (req, res) => {
    try {
        const { Data, AdminData } = req.body
        const file = req.file
        let avatar = null
    
        if (file && AdminData.full_name) {
            const folderName = AdminData.full_name.toLowerCase().replace(/\s+/g, "-")
            const userFolder = path.join("uploads", "avatars", folderName)
            fs.mkdirSync(userFolder, { recursive: true })

            const oldPath = file.path
            const newPath = path.join(userFolder, file.filename)
            fs.renameSync(oldPath, newPath)
      
            avatar = path.join("/uploads/avatars", folderName, file.filename).replace(/\\/g, "/")
        }
        const venue = await venuesAdminService.addVenue(Data, AdminData, file)
        return res.json(venue)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getCommisionReport = async (req, res) => {
    try {
        const id = req.user.id
        const updated = await venuesAdminService.getCommisionReport(id)
        return res.json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const createPromoCodes = async (req, res) => {
    try {
        const id = req.params.id
        const { promoCodeData } = req.body    
        const data = await venuesAdminService.createPromoCodes(promoCodeData, id)
        return res.json(data)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const makeDiscount = async (req, res) => {
    try {
        const admin_id = req.user.id
        const { discountData } = req.body
        const discount = await venuesAdminService.makeDiscount(discountData, admin_id)
        return res.json(discount)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getEarnings = async (req, res) => {
    try {
        const id = req.params.id
        const earnings = await venuesAdminService.getEarnings(id)
        return res.json(earnings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getMyVenue = async (req, res) => {
    try {
        const id = req.user.id
        const venue = await venuesAdminService.getMyVenue(id)
        return res.json(venue)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
} 