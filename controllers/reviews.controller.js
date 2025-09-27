import * as reviewsService from "./../services/reviews.service.js"

export const addReview = async (req, res) => {
    try {
        const location_id = req.params.location_id
        const customer_id = req.user.id
        const { rating, comment } = req.body
        const Data = { rating, comment } 
        const file = req.file
        let image = null
        if (file && customer_id) {
            const folderName = full_name.toLowerCase().replace(/\s+/g, "-")
            const userFolder = path.join("uploads", "avatars", folderName)
            fs.mkdirSync(userFolder, { recursive: true })

            const oldPath = file.path
            const newPath = path.join(userFolder, file.filename)
            fs.renameSync(oldPath, newPath)
      
            avatar = path.join("/uploads/avatars", folderName, file.filename).replace(/\\/g, "/")
        }
        const review = await reviewsService.addReview(Data, customer_id, location_id)
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteReview = async (req, res) => {
    try {
        const customer_id = req.user.id
        const review_id = req.params.review_id
        
        const review = await reviewsService.deleteReview(Number(review_id), Number(customer_id))
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updateReview = async (req, res) => {
    try {
        const location_id = req.params.location_id
        const customer_id = req.user.id
        const { Data } = req.body
        const review = await reviewsService.updateReview(Data, Number(customer_id), Number(location_id))
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showAllReviews = async (req, res) => {
    try {
        const review = await reviewsService.showAllReviews()
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showReview = async (req, res) => {
    try {
        const location_id = req.params.location_id
        const review = await reviewsService.showReview(location_id)
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showLocationReviews = async (req, res) => {
    try {
        const location_id = req.params.location_id
        const review = await reviewsService.showLocationReviews(Number(location_id))
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showCustomerReviews = async (req, res) => {
    try {
        const customer_id = req.params.customer_id
        const review = await reviewsService.showCustomerReviews(Number(customer_id))
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showMyReviews = async (req, res) => { 
    try {
        const customer_id = req.user.id        
        const review = await reviewsService.showMyReviews(Number(customer_id))
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showMyLocationReviews = async (req, res) => {
    try {
        const website_admin_id = req.user.id
        const review = await reviewsService.showMyLocationReviews(website_admin_id)
        return res.json(review)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}