import * as statsService from "./../services/stats.service.js"

export const totalEarnings = async (req, res) => {
    try {
        const earnings = await statsService.totalEarnings()
        return res.json(earnings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const averageMonthEarnings = async (req, res) => {
    try {
        const earnings = await statsService.averageMonthEarnings()
        return res.json(earnings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const lastMonthEarnings = async (req, res) => {
    try {
        const earnings = await statsService.lastMonthEarnings()
        return res.json(earnings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const totalUsers = async (req, res) => {
    try {
        const users = await statsService.totalUsers()
        return res.json(users)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const activeVenues = async (req, res) => {
    try {
        const venues = await statsService.activeVenues()
        return res.json(venues)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const avgUsersSpent = async (req, res) => {
    try {
        const spent = await statsService.avgUsersSpent()
        return res.json(spent)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const growthRevenueRate = async (req, res) => {
    try {
        const growth = await statsService.growthRevenueRate()
        return res.json(growth)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const topVenues = async (req, res) => {
    try {
        const growth = await statsService.topVenues()
        return res.json(growth)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const popularPlaces = async (req, res) => {
    try {
        const places = await statsService.popularPlaces()
        return res.json(places)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const logPlaceVisited = async (req, res) => {
    try {
        const { venue_id } = req.body
        if (!venue_id) {
            return res.status(400).json({ error: "venue_id is required" })
        }
        statsService.logPlaceVisited(venue_id)
        return res.json({ message: "Visit logged successfully" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}