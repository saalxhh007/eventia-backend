import hashHelper from "./../../helpers/hash.js"
import phoneHelper from "./../../helpers/phone.js"
import tokenHelper from "./../../helpers/token.js"
import mailHelper from "./../../helpers/mailer.js"
import prisma from './../../prisma/client.js'
import jwtTokens from "./../../helpers/jwt.js"
import path from "path"

import jwt from "jsonwebtoken"

const verificationCodes = new Map()

export const signUp = async (Data, file, is_admin=false) => {
    try {
        const email = Data.email
        const existing = await prisma.users.findUnique({ where: { email } })
        if (existing) throw new Error("Email Already In Use")

        const hashedPassword = await hashHelper.hashValue(Data.password)
        // const normalizedPhone = phoneHelper.normalizeNum(Data.phone)

        let avatarPath = Data.avatar || null
        if (file && Data.full_name) {
            const folderName = Data.full_name.toLowerCase().replace(/\s+/g, "-")
            avatarPath = path.join("/uploads/avatars", folderName, file.filename).replace(/\\/g, "/")
        }
        
        const user = await prisma.users.create({
            data: {
                ...Data,
                password: hashedPassword,
                avatar: avatarPath
            }
        })

        if (!is_admin) {
            const emailToken = tokenHelper.generateEmailToken(user.id)
            await mailHelper.sendVerificationEmail(email, emailToken)
            // const verificationCode = Math.floor(10000 + Math.random() * 90000).toString()
            // verificationCodes.set(email, verificationCode)
            // await phoneHelper.sendWhatsAppVerification(normalizedPhone, verificationCode)
        }
        return user
    } catch (error) {
        throw error
    }
}

export const login = async (Data) => {
    try {
        const email = Data.email
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) throw new Error("Invalid Credentials")
            
        const passwordValid = await hashHelper.compareValue(Data.password, user.password)
        if (!passwordValid) throw new Error("Invalid Credentials")
        
        if (user.status === "pending") {
            throw new Error("Firstly, Verify your email")
        }
        if (user.status === "banned") {
            throw new Error("You Are Banned From Accessing Eventia")
        }
    
        const payload = { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
        const accessToken = tokenHelper.generateAccessToken(payload)
        const refreshTokenPlain = tokenHelper.generateRefreshToken(payload)
        const expiresIn = '15m'
        const expiresAt = Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 60

        const refreshTokenHash = await hashHelper.hashValue(refreshTokenPlain)
        await prisma.users.update({
            where: { id: user.id },
            data: { refresh_token: refreshTokenHash }
        })
        const payloadUser = {
            id: payload.id,
            full_name: payload.fullName,
            email: payload.email
        }
        
        return {
            accessToken,
            refreshToken: refreshTokenPlain,
            role: payload.role,
            user: payloadUser,
            expires_in: expiresIn,
            expires_at: expiresAt
        }
    } catch (error) {
        throw error
    }
}

export const logout = async (id) => {
    try {
        const user = await prisma.users.findUnique({ where: { id } })
        if (!user) throw new Error("User not found")
    
        await prisma.users.update({
            where: { id },
            data: { refresh_token: "" }
        })
        return true
    } catch (error) {
        throw error
    }
}

export const refreshToken = async (token) => {
    try {
        const payload = jwt.verify(token, jwtTokens.refreshTokenSecret)
        const foundUser = await prisma.users.findUnique({ where: { id: payload.id } })
        if (!foundUser || !foundUser.refresh_token) throw new Error("Invalid token")
    
        const match = await hashHelper.compareValue(token, foundUser.refresh_token)
        if (!match) throw new Error("Invalid token")
    
        const { exp, iat, ...userPayload } = payload
        
        const expiresIn = '15m'
        const expiresAt = Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 60
    
        const newAccessToken = tokenHelper.generateAccessToken(userPayload)
        const newRefreshTokenPlain = tokenHelper.generateRefreshToken(userPayload)
        const newRefreshTokenHash = await hashHelper.hashValue(newRefreshTokenPlain)

        await prisma.users.update({
        where: { id: foundUser.id },
        data: { refresh_token: newRefreshTokenHash }
        })

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshTokenPlain,
            role: payload.role,
            user: userPayload,
            expires_in: expiresIn,
            expires_at: expiresAt
        }
    } catch (error) {
        throw error
    }
}

export const verifyEmail = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.EMAIL_SECRET)
        const user = await prisma.users.findUnique({
            where: {
                id: payload.id
            }
        })
        if (!user) throw new Error("Invalid token")
        const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: { status: "active" }
        })
        return updatedUser
    } catch (error) {
        throw new Error(error.message || "Email verification failed")
    }
}

// async function verifyWhatsAppCode(email, code) {
//   const savedCode = verificationCodes.get(email);

//   if (savedCode && savedCode === code) {
//     const user = await User.findOne({ where: { email } });
//     if (!user) throw new Error('User not found');

//     user.is_phone_verified = true;
//     await user.save();

//     verificationCodes.delete(email);
//     return user;
//   } else {
//     throw new Error('Invalid verification code');
//   }
// }

// async function sendWhatsAppVerification(phone, code) {
//   const client = await getClient();

//   const waId = phone.replace(/^\+/, '') + '@c.us';

//   const message = `Your BookStore verification code is: *${code}*`;

//   try {
//     await client.sendText(waId, message);
//   } catch (error) {
//     console.error('Failed to send WhatsApp message:', error);
//     throw new Error('WhatsApp message sending failed');
//   }
// }