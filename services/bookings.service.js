import prisma from "../prisma/client.js";

export const allBookings = async () => {
  try {
    return await prisma.bookings.findMany({
        include: {
            users: {
            select: {
                    id: true,
                    full_name: true,
                    email: true
          }
        },
        venues: {
          select: {
            id: true,
            name: true,
            capacity: true
          }
        }
      },
    })
  } catch (error) {
    throw error
  }
}

export const addBooking = async (Data, customer_id) => {
  try {
    if (!Data.venue_id && !customer_id) {
    return `required both venue id and customer id`
    }
    const booking = await prisma.bookings.create({
      data: {
        event_date: new Date(Data.event_date),
        attendances: Data.attendances,
        payment_status: Data.payment_status || "pending",
        payment_method: Data.payment_method,
        status: "pending",
        notes: Data.notes || null,
        customer_id,
        venue_id: Data.venue_id,
      },
    })
    return booking
  } catch (err) {
    throw new Error("Failed to add booking: " + err.message)
  }
}

export const deleteBooking = async (booking_id) => {
  try {
    await prisma.bookings.delete({
      where: { id: booking_id },
    })
    return { message: "Booking deleted successfully" }
  } catch (err) {
    throw new Error("Failed to delete booking: " + err.message)
  }
}

export const modifyBooking = async (Data, booking_id) => {
  try {
    const booking = await prisma.bookings.findMany({
      where: { id: booking_id }
    })
    if (!booking) {
      throw new Error("Booking Wasn't Found")
    }

    const updated = await prisma.bookings.update({
      where: { id: booking_id },
      data: {
        event_date: Data.event_date ? new Date(Data.event_date) : booking.event_date,
        attendances: Data.attendances ? Data.attendances : booking.attendances,
        payment_status: Data.paymentStatus ? Data.paymentStatus : booking.payment_status,
        payment_method: Data.paymentMethod ? Data.paymentMethod : booking.payment_method,
        status: Data.status ?? booking.status,
        notes: Data.notes ?? booking.notes,
        updated_at: new Date(),
      },
    })
    return updated
  } catch (err) {
    throw new Error("Failed to update booking: " + err.message)
  }
}

export const myVenueBookings = async (admin_id) => {
  try {
    const venue = await prisma.venues.findUnique({
      where: { admin_id },
    })

    if (!venue) {
      throw new Error("Venue not found for this admin")
    }

    const bookings = await prisma.bookings.findMany({
      where: {
        venue_id: venue.id,
        status: { in: ["pending", "confirmed"] },
      },
      include: {
        users: {
          select: {
            full_name: true,
            email: true,
          },
        },
        venues: {
          select: {
            price: true,
            category: true
          }
        }
      },
    })

    const now = new Date()
    return bookings.map((booking) => ({
      ...booking,
      type: booking.event_date >= now ? "upcoming" : "past",
    }))
  } catch (err) {
    throw new Error("Failed to fetch bookings: " + err.message)
  }
}

export const manageReqs = async (booking_id, status) => {
  try {
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      throw new Error("Invalid booking status")
    }

    const updated = await prisma.bookings.update({
      where: { id: booking_id },
      data: { status, updated_at: new Date() },
    })
    return updated
  } catch (err) {
    throw new Error("Failed to manage booking: " + err.message)
  }
}

export const myBookings = async (customer_id) => {
  try {
    return await prisma.bookings.findMany({
      where: { customer_id },
      include: { venues: true },
    })
  } catch (err) {
    throw new Error("Failed to fetch bookings: " + err.message)
  }
}

export const cancellationReq = async (customer_id, booking_id, reason) => {
  try {
    const booking = await prisma.bookings.findUnique({ where: { id: booking_id } })

    if (!booking || booking.customer_id !== customer_id) {
      throw new Error("Not authorized to cancel this booking.")
    }

    const updated = await prisma.bookings.update({
      where: { id: booking_id },
      data: {
        status: "canceled",
        canceled: true,
        cancelation_reason: reason || "No reason provided",
        updated_at: new Date(),
      },
    })
    return updated
  } catch (err) {
    throw new Error("Failed to request cancellation: " + err.message)
  }
}

export const bookingResult = async (customer_id) => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: { customer_id },
      include: { venues: true },
      orderBy: { created_at: "desc" },
    })

    return bookings.map((b) => ({
      id: b.id,
      venue: b.venues?.title,
      event_date: b.event_date,
      status: b.status,
      payment_status: b.payment_status,
    }))
  } catch (err) {
    throw new Error("Failed to fetch booking results: " + err.message)
  }
}