import prisma from "../prisma/client.js"
// Add new feedback
export const addFeedback = async (data) => {
  try {
    const feedback = await prisma.feedbacks.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    })
    return feedback
  } catch (error) {
    throw new Error("Error adding feedback: " + error.message)
  }
}

// Delete feedback by id
export const deleteFeedback = async (id) => {
  try {
    const feedback = await prisma.feedbacks.delete({
      where: { id },
    })
    return feedback
  } catch (error) {
    throw new Error("Error deleting feedback: " + error.message)
  }
}

// Show all feedbacks
export const showAllFeedbacks = async () => {
  try {
    const feedbacks = await prisma.feedbacks.findMany({
      orderBy: { id: "desc" },
    })
    return feedbacks
  } catch (error) {
    throw new Error("Error fetching feedbacks: " + error.message)
  }
}

// Show single feedback by id
export const showFeedback = async (id) => {
  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: { id },
    })
    if (!feedback) throw new Error("Feedback not found")
    return feedback
  } catch (error) {
    throw new Error("Error fetching feedback: " + error.message)
  }
}

// Update feedback
export const updateFeedback = async (data, id) => {
  try {
    const feedback = await prisma.feedbacks.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    })
    return feedback
  } catch (error) {
    throw new Error("Error updating feedback: " + error.message)
  }
}
