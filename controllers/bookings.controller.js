import * as bookingsService from "./../services/bookings.service.js"

export const allBookings = async (req, res) => {
    try {
        const bookings = await bookingsService.allBookings()
        return res.json({...bookings})
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const addBooking = async (req, res) => {
    try {
        const customer_id = req.user.id
        const { Data } = req.body
        const booking = await bookingsService.addBooking(Data, customer_id)
        return res.json(booking)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteBooking = async (req, res) => { 
    try {
        const booking_id = req.params.id
        const deleted = await bookingsService.deleteBooking(Number(booking_id))
        return res.json(deleted)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const modifyBooking = async (req, res) => {
    try {
        const booking_id = req.params.id
        const { Data } = req.body
        const booking = await bookingsService.modifyBooking(Data, Number(booking_id))
        return res.json(booking)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const myVenueBookings = async (req, res) => { 
    try {
        const admin_id = req.user.id
        const bookings = await bookingsService.myVenueBookings(Number(admin_id))
        return res.json(bookings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const manageReqs = async (req, res) => {
    try {
        const booking_id = req.params.id
        const { status } = req.body
        const bookings = await bookingsService.manageReqs(Number(booking_id), status)
        return res.json(bookings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const myBookings = async (req, res) => {
    try {
        const customer_id = req.user.id
        const bookings = await bookingsService.myBookings(customer_id)
        return res.json(bookings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// /// //// ////// //////
export const cancellationReq = async (req, res) => {
    try {
        const customer_id = req.user.id
        const booking_id = req.params.id
        const { reason } = req.body
        const bookings = await bookingsService.cancellationReq(Number(customer_id), Number(booking_id), reason)
        return res.json(bookings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
// /// //// ///// //////
export const bookingResult = async (req, res) => {
    try {
        const customer_id = req.user.id
        const bookings = await bookingsService.bookingResult(customer_id)
        return res.json(bookings)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}