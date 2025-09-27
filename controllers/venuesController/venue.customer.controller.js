import * as venuesCustomerService from "./../../services/VenueServices/venues.customer.service.js"

export const venuesSuggestions = async (req, res) => {
    try {
        const id = req.user.id
        const suggestions = await venuesCustomerService.venuesSuggestions(id)
        return res.json(suggestions)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}