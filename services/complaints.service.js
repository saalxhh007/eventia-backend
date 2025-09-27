import prisma from "../prisma/client.js"

export const addComplaint = async (Data, customer_id) => {
  try {
    return await prisma.complaints.create({
      data: {
        subject: Data.subject,
        message: Data.message,
        status: "sent",
        customer_id,
        location_id: Data.location_id || null,
      },
    })
  } catch (err) {
    throw new Error("Failed to add complaint: " + err.message)
  }
}

export const deleteComplaint = async (complaint_id, customer_id) => {
  try {
    const complaint = await prisma.complaints.findUnique({ where: { id: complaint_id } })
    if (!complaint) throw new Error("Complaint not found");
    if (complaint.customer_id !== customer_id) {
      throw new Error("Not authorized to delete this complaint")
    }

    await prisma.complaints.delete({ where: { id: complaint_id } })
    return { message: "Complaint deleted successfully" }
  } catch (err) {
    throw new Error("Failed to delete complaint: " + err.message)
  }
}

export const showAllComplaints = async () => {
  try {
    return await prisma.complaints.findMany({
        include: {
            users: {
                select: {
                    full_name: true,
                    email: true
                }
            },
            venues: {
                select: {
                    name
                }
            }
        },
        orderBy: { created_at: "desc" }
    })
  } catch (err) {
    throw new Error("Failed to fetch complaints: " + err.message)
  }
}

export const showComplaint = async (complaint_id) => {
  try {
      return await prisma.complaints.findMany({
          where: {
            id: complaint_id
        }
    })
  } catch (err) {
    throw new Error("Failed to fetch complaints: " + err.message)
  }
}

export const updateComplaint = async (Data, complaint_id) => {
  try {
    const complaint = await prisma.complaints.findFirst({
      where: { id: complaint_id },
    })
      
    if (!complaint) {
      throw new Error("Review not found or unauthorized.");
    }

    const updated = await prisma.complaints.update({
      where: { id: complaint.id },
      data: {
        subject: Data.subject ?? complaint.subject,
        message: Data.message ?? complaint.message,
      },
    })
    return updated
  } catch (err) {
    throw new Error("Failed to update complaint: " + err.message)
  }
}

export const showLocationComplaint = async () => {
  try {
    return await prisma.complaints.findMany({
      include: { users: true, venues: true },
      orderBy: { created_at: "desc" },
    })
  } catch (err) {
    throw new Error("Failed to fetch complaints: " + err.message)
  }
}

export const ShowCustomerComplaint = async (customer_id) => {
  try {
    return await prisma.complaints.findMany({
      where: { customer_id },
      orderBy: { created_at: "desc" },
    })
  } catch (err) {
    throw new Error("Failed to fetch location complaints: " + err.message)
  }
}

export const ShowMyComplaints = async (customer_id) => {
  try {
    return await prisma.complaints.findMany({
      where: { customer_id },
      orderBy: { created_at: "desc" },
    })
  } catch (err) {
    throw new Error("Failed to fetch my complaints: " + err.message)
  }
}