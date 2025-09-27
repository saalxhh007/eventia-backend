import jwtTokens from "./jwt.js";
import jwt from "jsonwebtoken"

function generateEmailToken(id) {
  if (!process.env.EMAIL_SECRET) throw new Error("JWT_SECRET not set in env")
  return jwt.sign({ id }, process.env.EMAIL_SECRET, { expiresIn: "1d" })
}

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtTokens.accessTokenSecret, {
    expiresIn: jwtTokens.accessTokenExpiry,
  })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtTokens.refreshTokenSecret, {
    expiresIn: jwtTokens.refreshTokenExpiry,
  })
}

export const generaterestoreToken = (id) => {
  if (!process.env.PASS_RESET_SECRET) throw new Error("PASS_RESET_SECRET not set in env")
  return jwt.sign({ id }, process.env.PASS_RESET_SECRET, { expiresIn: "15m" })
}

export default {
  generateEmailToken,
  generateAccessToken,
  generateRefreshToken,
  generaterestoreToken
}