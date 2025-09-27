import * as feedbackService from "./../services/feedbacks.service.js"

export const addFeedback = async (req, res) => {
    try {
        const { Data } = req.body
        const feedback = await feedbackService.addFeedback(Data)
        return res.json(feedback)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteFeedback = async (req, res) => {
    try {
        const feedback_id = req.params.id
        const feedback = await feedbackService.deleteFeedback(Number(feedback_id))
        return res.json(feedback)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.showAllFeedbacks()
        return res.json(feedbacks)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showFeedback = async (req, res) => {
    try {
        const feedback_id = req.params.id
        const feedback = await feedbackService.showFeedback(Number(feedback_id))
        return res.json(feedback)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updateFeedback = async (req, res) => {
    try {
        const feedback_id = req.params.id
        const { Data } = req.body
        const feedback = await feedbackService.updateFeedback(Data, Number(feedback_id))
        return res.json(feedback)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
