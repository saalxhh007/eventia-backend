export const parseFormData = (req, res, next) => {
  if (req.body.Data) {
    try {
      req.body.Data = JSON.parse(req.body.Data)
    } catch (e) {
      return res.status(400).json({ error: "Invalid Data JSON" })
    }
  }
  if (req.body.AdminData) {
    try {
      req.body.AdminData = JSON.parse(req.body.AdminData)
    } catch (e) {
      return res.status(400).json({ error: "Invalid AdminData JSON" })
    }
  }
  next()
}