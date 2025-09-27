import prisma from "./../prisma/client.js"

export const addReview = async (Data, customer_id, location_id) => {
  try {
    const review = await prisma.reviews.create({
      data: {
        rating: Data.rating,
        comment: Data.comment ?? "",
        image: Data.image || null,
        customer_id,
        venue_id: Number(location_id),
      },
    })
    return review
  } catch (err) {
    throw new Error("Failed to add review: " + err.message)
  }
}

export const deleteReview = async (review_id, customer_id) => {   
  try {
    const review = await prisma.reviews.findUnique({ where: { id: review_id } })
    
    if (!review || review.customer_id !== customer_id) {
      throw new Error("Not authorized to delete this review.")
    }

    await prisma.reviews.delete({ where: { id: Number(review_id) } })
    return { message: "Review deleted successfully." }
  } catch (err) {
    throw new Error("Failed to delete review: " + err.message)
  }
}

export const updateReview = async (Data, customer_id, location_id) => {
  try {
    const review = await prisma.reviews.findFirst({
      where: { customer_id, venue_id: location_id },
    })
      
    if (!review) {
      throw new Error("Review not found or unauthorized.");
    }

    const updated = await prisma.reviews.update({
      where: { id: review.id },
      data: {
        rating: Data.rating ?? review.rating,
        comment: Data.comment ?? review.comment,
        image: Data.image ?? review.image,
      },
    })
    return updated
  } catch (err) {
    throw new Error("Failed to update review: " + err.message)
  }
}

export const showAllReviews = async () => {
  try {
    const reviews = await prisma.reviews.findMany({})
    return reviews
  } catch (err) {
    throw new Error("Failed to update review: " + err.message)
  }
}

export const showReview = async (location_id) => {
  try {
    return await prisma.reviews.findFirst({
      where: { venue_id: location_id },
      include: { users: true },
    })
  } catch (err) {
    throw new Error("Failed to fetch location reviews: " + err.message)
  }
}

export const showLocationReviews = async (location_id) => {
  try {
    return await prisma.reviews.findMany({
      where: { venue_id: location_id },
      include: {
        users: {
          select: {
            full_name: true,
            email: true
          }
        }
      },
    })
  } catch (err) {
    throw new Error("Failed to fetch location reviews: " + err.message)
  }
}

export const showCustomerReviews = async (customer_id) => { 
  try {
    return await prisma.reviews.findMany({
      where: { customer_id },
      include: { venues: true },
    })
  } catch (err) {
    throw new Error("Failed to fetch customer reviews: " + err.message)
  }
}

export const showMyReviews = async (customer_id) => {
  try {
    return await prisma.reviews.findMany({
      where: { customer_id },
    })
  } catch (err) {
    throw new Error("Failed to fetch customer reviews: " + err.message)
  }
}

export const showMyLocationReviews = async (website_admin_id) => {
  try {
    return await prisma.reviews.findMany({
      where: {
        venues: {
          admin_id: website_admin_id,
        },
      },
      include: {
        users: {
          select: {
            full_name: true,
            email: true
          }
        },
      },
    });
  } catch (err) {
    throw new Error("Failed to fetch my location reviews: " + err.message);
  }
}
