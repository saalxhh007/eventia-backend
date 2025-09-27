
import prisma from "../../prisma/client.js";

export const venuesSuggestions = async (id) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        state: true,
        district: true,
        municipality: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Parse preferences
    let preferences = {};
    if (user.preferences) {
      try {
        preferences =
          typeof user.preferences === "string"
            ? JSON.parse(user.preferences)
            : user.preferences;
      } catch {
        preferences = {};
      }
    }

    let venues = [];

    // --- 1) Based on preferences ---
    if (Object.keys(preferences).length > 0) {
      const filters = {
        is_active: true,
        is_available: true,
      };

      if (preferences.category) filters.category = preferences.category;
      if (preferences.minCapacity && preferences.maxCapacity) {
        filters.capacity = {
          gte: preferences.minCapacity,
          lte: preferences.maxCapacity,
        };
      }
      if (preferences.minPrice && preferences.maxPrice) {
        filters.price = {
          gte: preferences.minPrice,
          lte: preferences.maxPrice,
        };
      }

      venues = await prisma.venues.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          address: true,
          state: true,
          district: true,
          municipality: true,
          capacity: true,
          price: true,
          images: {
            select: {
              id: true,
              image_url: true,
              title: true,
              is_cover: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              created_at: true,
              customer_id: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: 10,
      });
    }

    // --- 2) Based on booking history ---
    if (venues.length === 0) {
        const bookings = await prisma.bookings.findMany({
        where: { customer_id: id },
        select: { venue_id: true },
        });

        if (bookings.length > 0) {
        const bookedVenueIds = bookings.map((b) => b.venue_id);

        const bookedVenues = await prisma.venues.findMany({
            where: { id: { in: bookedVenueIds } },
            select: {
            id: true,
            state: true,
            category: true,
            },
        });

        const bookedStates = [...new Set(bookedVenues.map((v) => v.state))];
        const bookedCategories = [...new Set(bookedVenues.map((v) => v.category))];

        venues = await prisma.venues.findMany({
            where: {
            is_active: true,
            is_available: true,
            state: { in: bookedStates },
            category: { in: bookedCategories },
            id: { notIn: bookedVenueIds },
            },
            select: {
            id: true,
            name: true,
            description: true,
            category: true,
            state: true,
            district: true,
            municipality: true,
            capacity: true,
            price: true,
            images: {
                select: {
                id: true,
                image_url: true,
                title: true,
                is_cover: true,
                },
            },
            reviews: {
                select: {
                id: true,
                rating: true,
                comment: true,
                },
            },
            },
            take: 10,
        });
        }
    }

    // --- 3) Fallback: same location ---
    if (venues.length === 0) {
      venues = await prisma.venues.findMany({
        where: {
          is_active: true,
          is_available: true,
          state: user.state,
          district: user.district,
          municipality: user.municipality,
        },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          address: true,
          state: true,
          district: true,
          municipality: true,
          capacity: true,
          price: true,
          images: {
            select: {
              id: true,
              image_url: true,
              title: true,
              is_cover: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              created_at: true,
              customer_id: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: 10,
      });
    }

    return JSON.parse(JSON.stringify(venues))
  } catch (error) {
    throw error;
  }
}