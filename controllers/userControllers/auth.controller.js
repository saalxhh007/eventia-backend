import path from "path"
import * as authService from "./../../services/UserServices/auth.service.js"
import fs from "fs"
import tokenHelper from "./../../helpers/token.js"
import hashHelper from "./../../helpers/hash.js"

export const signUp = async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            date_of_birth,
            address,
            state,
            district,
            municipality,
            preferences,
            password
        } = req.body
    
        const file = req.file
        let avatar = null
    
        if (file && full_name) {
            const folderName = full_name.toLowerCase().replace(/\s+/g, "-")
            const userFolder = path.join("uploads", "avatars", folderName)
            fs.mkdirSync(userFolder, { recursive: true })

            const oldPath = file.path
            const newPath = path.join(userFolder, file.filename)
            fs.renameSync(oldPath, newPath)
      
            avatar = path.join("/uploads/avatars", folderName, file.filename).replace(/\\/g, "/")
        }

        const Data = {
            full_name,
            email,
            phone,
            date_of_birth,
            address,
            state,
            district,
            municipality,
            password,
            preferences,
            avatar
        }
        const user = await authService.signUp(Data, file)
        return res.status(201).json(user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const login = async (req, res) => {
    try {
    const { Data } = req.body
    const { accessToken, refreshToken, role, user, expires_at, expires_in } = await authService.login(Data)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.json({
        accessToken,
        role,
        user,
        expires_in,
        expires_at
    })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
    const id = req.user.id
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })
    const logout = await authService.logout(id)
    return res.json({
        logout
    })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const refreshToken = async (req, res) => {
    try {
    const oldToken = req.cookies.refreshToken
    if (!oldToken) return res.status(401).json({ error: "Refresh token missing" })
        const {
            accessToken,
            refreshToken,
            role,
            user,
            expires_in,
            expires_at } = await authService.refreshToken(oldToken)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return res.json({
        accessToken,
        role,
        user,
        expires_in,
        expires_at
    })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const token = req.query.token
    const user = await authService.verifyEmail(token)
    return res.json({
        user
    })
}

export const oauthController = {
  oauthCallback: async (req, res) => {
    try {
      const user = req.user
      const payload = { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
      
      const accessToken = tokenHelper.generateAccessToken(payload)
      const refreshToken = tokenHelper.generateRefreshToken(payload)
      
      const refreshTokenHash = await hashHelper.hashValue(refreshToken)

      await prisma.users.update({
        where: { id: user.id },
        data: { refresh_token: refreshTokenHash },
      })

      res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: false })
      return res.json({ accessToken, user })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
  },
}
