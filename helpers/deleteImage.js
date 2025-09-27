import path from "path"
import fs from "fs"

export const deleteFile = (filePath) => {
  try {
    if (!filePath) return
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath)
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath)
  } catch (e) {
    console.error("File delete error:", e.message)
  }
}