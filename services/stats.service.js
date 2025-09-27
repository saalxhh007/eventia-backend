import prisma from "../prisma/client.js";

const COMMISSION_RATE = 0.1
export const totalEarnings = async () => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        payment_status: "paid",
        canceled: false,
      },
      include: {
        venues: {
          select: {
            price: true
          }
        }
      }
    })
     
      const total = bookings.reduce((sum, booking) => {
      if (!booking.venues) return sum
      const commission = Number(booking.venues.price) * COMMISSION_RATE
      return sum + commission
      }, 0)
      
    return totalEarnings
  } catch (error) {
    throw error
  }
}

export const lastMonthEarnings = async () => {
    try {
    const now = new Date()
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const bookings = await prisma.bookings.findMany({
      where: {
        payment_status: "paid",
        canceled: false,
        created_at: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
      include: {
        venues: { select: { price: true } }
      }
    })

    const total = bookings.reduce((sum, booking) => {
      if (!booking.venues) return sum
      const commission = Number(booking.venues.price) * COMMISSION_RATE
      return sum + commission
    }, 0)

    return total 
  } catch (error) {
    throw error
  }
}

export const averageMonthEarnings = async () => {
    try {
    const bookings = await prisma.bookings.findMany({
      where: {
        payment_status: "paid",
        status: "completed",
        canceled: false,
      },
      include: {
        venues: { select: { price: true } }
      }
    })

    if (bookings.length === 0) {
      return { averageMonthEarnings: 0 }
    }

    // Calculate total earnings
    const totalEarnings = bookings.reduce((sum, booking) => {
      if (!booking.venues) return sum
      const commission = Number(booking.venues.price) * COMMISSION_RATE
      return sum + commission
    }, 0)

    // Find time span in months (from first booking to now)
    const firstBookingDate = bookings.reduce((earliest, booking) =>
      booking.created_at < earliest ? booking.created_at : earliest,
      bookings[0].created_at
    )

    const now = new Date()
    const months =
      (now.getFullYear() - firstBookingDate.getFullYear()) * 12 +
      (now.getMonth() - firstBookingDate.getMonth()) + 1

    const avg = totalEarnings / months

    return avg
  } catch (error) {
    throw error
  }
}

export const totalUsers = async () => {
  try {
    const count = await prisma.users.count({
      where: {
        status: { not: "banned" },
        role: "customer"
      }
    })
    return count
  } catch (error) {
    throw error
  }
}

export const activeVenues = async () => {
    try {
    const count = await prisma.venues.count({
      where: {
        is_active: true,
      }
    })
    return count
  } catch (error) {
    throw error
  }
}

export const avgUsersSpent = async () => {
    try {
    const bookings = await prisma.bookings.findMany({
      where: {
        payment_status: "paid",
        canceled: false
      },
      include: {
        venues: { select: { price: true } }
      }
    })

    if (bookings.length === 0) return { avgUsersSpent: 0 }

    const total = bookings.reduce((sum, b) => {
      if (!b.venues) return sum
      return sum + Number(b.venues.price) * COMMISSION_RATE
    }, 0)

    const uniqueCustomers = new Set(bookings.map(b => b.customer_id)).size
    const avg = total / (uniqueCustomers || 1)

    return avg
  } catch (error) {
    throw error
  }
}

export const growthRevenueRate = async () => {
    try {
        const now = new Date()
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        
        const thisMonthBookings = await prisma.bookings.findMany({
            where: {
                payment_status: "paid",
                canceled: false,
                created_at: { gte: firstDayThisMonth, lt: firstDayNextMonth }
            },
            include: { venues: { select: { price: true } } }
        })
        
        const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => {
            if (!b.venues) return sum
            return sum + Number(b.venues.price) * COMMISSION_RATE
        }, 0)

        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const firstDayThisMonthCopy = new Date(now.getFullYear(), now.getMonth(), 1)

        const lastMonthBookings = await prisma.bookings.findMany({
            where: {
                payment_status: "paid",
                canceled: false,
                created_at: { gte: firstDayLastMonth, lt: firstDayThisMonthCopy }
            },
            include: { venues: { select: { price: true } } }
        })

        const lastMonthEarnings = lastMonthBookings.reduce((sum, b) => {
            if (!b.venues) return sum
            return sum + Number(b.venues.price) * COMMISSION_RATE
        }, 0)

        const growthRate = lastMonthEarnings === 0
            ? 100
            : ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
    
        return {
            growthRate,
            thisMonthEarnings,
            lastMonthEarnings
        }
  } catch (error) {
    throw error
  }
}

export const topVenues = async () => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        payment_status: "paid",
        status: "completed",
        canceled: false
      },
      include: {
        venues: { select: { id: true, name: true, price: true } }
      }
    })

    if (bookings.length === 0) return []

    // Aggregate by venue
    const venueStats = {}

    for (const booking of bookings) {
      if (!booking.venues) continue
      const venueId = booking.venues.id

      if (!venueStats[venueId]) {
        venueStats[venueId] = {
          name: booking.venues.name,
          bookings: 0,
          earnings: 0
        }
      }

      venueStats[venueId].bookings += 1
      venueStats[venueId].earnings += Number(booking.venues.price) * COMMISSION_RATE
    }

    // Convert to array and sort by earnings (descending)
    const sorted = Object.values(venueStats).sort((a, b) => b.earnings - a.earnings)

    return sorted
  } catch (error) {
    throw error
  }
}

export const popularPlaces = async () => {
  try {
    const popular = await prisma.venue_visits.groupBy({
      by: ["venue_id"],
      _count: { venue_id: true },
      orderBy: { _count: { venue_id: "desc" } },
      take: 11,
    });

    const results = await Promise.all(
      popular.map(async (p) => {
        const venue = await prisma.venues.findUnique({
          where: { id: Number(p.venue_id) },
          select: {
            id: true,
            name: true,
            state: true,
            reviews: {
              select: {
                id: true,
                rating: true,
              },
              where: { status: "active" },
            },
            images: {
              select: {
                id: true,
                image_url: true,
                title: true,
              },
              where: { is_cover: true },
              take: 1,
            },
          },
        });

        return {
          ...venue,
          visit_count: p._count.venue_id,
        };
      })
    );

    return results
  } catch (err) {
    throw err
  }
}

export const logPlaceVisited = async (venue_id) => {
    try {

      await prisma.venue_visits.create({
        data: { venue_id },
      })
      
        return true
    } catch (err) {
      throw err
    }
}