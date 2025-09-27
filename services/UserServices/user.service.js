import prisma from "./../../prisma/client.js"

export const updateUser = async (id, updatedData) => {
    try {
        const user = await prisma.users.update({
            where: { id: parseInt(id) },
            data: updatedData,
        })
        return user
    } catch (error) {
        throw error
    }

}

export const deleteUser = async (id) => {
    try {
        await prisma.users.delete({
            where: { id: parseInt(id) },
        })
        return true
    } catch (error) {
        throw error
    }
}

export const showAllUsers = async () => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                full_name: true,
                role: true,
                email: true,
                phone: true,
                address: true,
                state: true,
                district: true,
                municipality: true,
                preferences: true,
                status: true,
                avatar: true,
                created_at: true,
                updated_at: true
            },
        })
        return users
    } catch (error) {
        throw error
    }
}

export const showUser = async (id) => {
    try {
        const user = await prisma.users.findUnique({
            where: {  id: parseInt(id)  },
            select: {
                id: true,
                full_name: true,
                role: true,
                email: true,
                phone: true,
                address: true,
                state: true,
                district: true,
                municipality: true,
                preferences: true,
                status: true,
                avatar: true,
                created_at: true,
                updated_at: true
            },
        })
        if (!user) throw new Error("User not found")
        return user
    } catch (error) {
        throw error
    }
 }
export const blockUser = async (id) => {
    try {
        await prisma.users.update({
            where: {  id: parseInt(id) },
            data: { status: "banned" },
        })
        return true
    } catch (error) {
        throw error
    }
}

export const unblockUser = async (id) => {
    try {
        await prisma.users.update({
            where: {  id: parseInt(id) },
            data: { status: "active" },
        })
        return true
    } catch (error) {
        throw error
    }
}

export const allCustomers = async () => {
    try {
        return prisma.users.findMany({
            where: {
                role: "customer"
            },
        })
        .then((users) => {
            return users.map(user => ({
                ...user,
                dateOfBirth: user.date_of_birth,
                date_of_birth: undefined
            }))
        }).catch((err) => {
            throw err
        })
    } catch (error) {
        throw error
    }
}

export const allVenueAdmins = async () => {
  try {
    const admins = await prisma.users.findMany({
      where: {
        role: "location_admin",
      },
      include: {
        venues: true,
      },
    })
    return admins
  } catch (error) {
    throw error
  }
}