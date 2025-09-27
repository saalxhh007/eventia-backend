import * as usersService from "./../../services/UserServices/user.service.js"

export const updateUser = async (req, res) => {
    try {
        const { updatedData } = req.body
        const id = req.params.id
        const updateUser = await usersService.updateUser(id, updatedData)
        return res.json(updateUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const deletedUser = await usersService.deleteUser(id)
        res.json(deletedUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showAllUsers = async(req, res) => {
    try {
        const users = await usersService.showAllUsers()
        res.json(users)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await usersService.showUser(id)
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const blockUser = async (req, res) => {
    try {
        const id = req.params.id
        const blockedUser = await usersService.blockUser(id)
        res.json(blockedUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const unblockUser = async (req, res) => {
    try {
        const id = req.params.id
        const blockedUser = await usersService.unblockUser(id)
        res.json(blockedUser)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const allCustomers = async (req, res) => {
    try {
        const customers = await usersService.allCustomers()
        res.json(customers)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const allVenueAdmins = async (req, res) => {
    try {
        const venueAdmins = await usersService.allVenueAdmins()
        res.json(venueAdmins)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}