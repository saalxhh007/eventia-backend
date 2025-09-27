import prisma from "./../../prisma/client.js";
import tokenHelper from "./../../helpers/token.js"
import mailHelper from "./../../helpers/mailer.js"
import hashHelper from "./../../helpers/hash.js"

import jwt from "jsonwebtoken"
import path from "path"
import fs from "fs";

export const updateProfile = async (Data, id) => {
    try {
    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) throw new Error("User not found")
        
    const first_name = Data.first_name ? Data.first_name : user.full_name.split(" ")[0]
    const last_name = Data.last_name ? Data.last_name : user.full_name.split(" ")[1]
    const date_of_birth = Data.profileData.date_of_birth 
        ? new Date(Data.profileData.date_of_birth).toISOString() 
        : user.date_of_birth
    
    const data = await prisma.users.update({
      where: { id: Number(id) },
        data: {
            full_name: `${first_name} ${last_name}`,
            email: Data.profileData.email || user.email,
            phone: Data.profileData.phone || user.phone,
            date_of_birth: date_of_birth,
            address: Data.profileData.address || user.address,
        },
    })
        
    return data
    } catch (error) {
        throw error
    }
}

export const updatePassword = async (oldPassword, newPassword, id) => {
    try {
    const user = await prisma.users.findUnique({ where: { id } })
    if (!user) throw new Error("User not found")

    const isMatch = await hashHelper.compareValue(oldPassword, user.password)
    if (!isMatch) throw new Error("Old password is incorrect")

    const hashedPassword = await hashHelper.hashValue(newPassword)

    await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return { message: "Password updated successfully" }
    } catch (error) {
        throw error
    }
}

export const forgetPassword = async (email) => {
    try {
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) throw new Error("User not found")
        
        const emailToken = tokenHelper.generaterestoreToken(user.id)
        await mailHelper.sendPasswordRestoreMail(email, emailToken)
        return true
    } catch (error) {
        throw error
    }
}

export const restorePassword = async (token, newPassword) => {
    try {
        const payload = jwt.verify(token, process.env.PASS_RESET_SECRET)
        const user = await prisma.users.findUnique({
            where: {
                id: payload.id
            }
        })
        if (!user) throw new Error("Invalid token")
        const hashedPassword = await hashHelper.hashValue(newPassword)
        
        await prisma.users.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })
        return true
    } catch (error) {
        throw error
    }
}

export const getMyProfile = async (id) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                full_name: true,
                email: true,
                phone: true,
                date_of_birth: true,
                address: true,
                state: true,
                district: true,
                municipality: true,
                preferences: true,
                avatar: true,
                created_at: true
            },
        })
        if (!user) throw new Error("User not found")
        return user
    } catch (error) {
        throw error
    }
}

export const updateProfilePic = async (file, id) => {
    try {
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) throw new Error("User not found")
    
        if (user.avatar) {
            const oldPath = path.join(process.cwd(), user.avatar)
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        const folderName = user.full_name.toLowerCase().replace(/\s+/g, "-")
        const userFolder = path.join("uploads", "avatars", folderName)
        fs.mkdirSync(userFolder, { recursive: true })
        
        
        const newPath = path.join(userFolder, file.filename)
        fs.renameSync(file.path, newPath)
    
        const avatarPath = path.join("/uploads/avatars", folderName, file.filename).replace(/\\/g, "/")
    
        const updatedUser = await prisma.users.update({
            where: { id },
            data: { avatar: avatarPath }
        })
    } catch (error) {
        throw error
    }
}

export const deleteMyProfile = async (id) => {
    try {
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) throw new Error("User not found")
        if (user.avatar && fs.existsSync(path.resolve(user.avatar))) {
            fs.unlinkSync(path.resolve(user.avatar))
        }
        await prisma.users.delete({ where: { id } })
        return true
    } catch (error) {
        throw error
    }
}