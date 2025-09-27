import * as venuesService from "./../../services/VenueServices/venues.admin.service.js"

export const updateVenue = async (req, res) => {
    try {
        const id = req.params.id
        const { updatedData } = req.body
        const updated = await venuesService.updateVenue(updatedData, id)
        return res.json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteVenue = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await venuesService.deleteVenue(id)
        return res.json(deleted)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getAllVenues = async (req, res) => {
    try {
        const venues = await venuesService.getAllVenues()
        return res.json(venues)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getVenue = async (req, res) => {
    try {
        const id = req.params.id
        const venue = await venuesService.getVenue(id)
        return res.json(venue)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const activateVenue = async (req, res) => {
    try {
        const id = req.params.id
        const venue = await venuesService.activateVenue(id)
        return res.json(venue)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const availableVenue = async (req, res) => {
    try {
        const id = req.params.id
        const venue = await venuesService.availableVenue(id)
        return res.json(venue)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}