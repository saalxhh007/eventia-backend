
import bcrypt from "bcrypt"

async function hashValue(password) {
  return await bcrypt.hash(password, 10)
}

async function compareValue(oldPassword, newPassword) {
  return await bcrypt.compare(oldPassword, newPassword)
}

export default { hashValue, compareValue }