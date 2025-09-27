import * as profileService from "./../../services/UserServices/profile.service.js"

export const updateProfile = async (req, res) => {
    try {
        const user_id = req.user.id
        const { Data } = req.body        
        const updated = await profileService.updateProfile(Data, user_id)
        return res.status(201).json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body.data
        const id = req.user.id
        const updated = await profileService.updatePassword(currentPassword, newPassword, id)
        return res.status(201).json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const updated = await profileService.forgetPassword(email)
        return res.status(201).json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const restorePassword = async (req, res) => {
    try {
        const token = req.query.token
        const { newPassword } = req.body
        const restored = await profileService.restorePassword(token, newPassword)
        return res.status(201).json(restored)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const id = req.user.id
        const profile = await profileService.getMyProfile(id)
        return res.status(201).json(profile)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updateProfilePic = async (req, res) => { 
    try {
        const file = req.file
        if (!file) {
            return res.status(400).json({ error: "Avatar file is required" })
        }
        const id = req.user.id
        const updated = await profileService.updateProfilePic(file, id)
        return res.status(201).json(updated)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteMyProfile = async (req, res) => {
    try {
        const id = req.user.id
        const deleted = await profileService.deleteMyProfile(id)
        return res.status(201).json(deleted)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}