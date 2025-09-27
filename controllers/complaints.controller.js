import * as complaintService from "./../services/complaints.service.js"

export const addComplaint = async (req, res) => {
    try {
        const { Data } = req.body
        const customer_id = req.user.id
        const complaint = await complaintService.addComplaint(Data, Number(customer_id))
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteComplaint = async (req, res) => {
    try {
        const complaint_id = req.params.id
        const customer_id = req.user.id
        const complaint = await complaintService.deleteComplaint(Number(complaint_id), Number(customer_id))
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showAllComplaints = async (req, res) => {
    try {
        const complaints = await complaintService.showAllComplaints()
        return res.json(complaints)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showComplaint = async (req, res) => {
    try {
        const complaint_id = req.params.id
        const complaint = await complaintService.showComplaint(Number(complaint_id))
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updateComplaint = async (req, res) => {
    try {
        const complaint_id = req.params.id
        const { Data } = req.body
        const complaint = await complaintService.updateComplaint(Data, Number(complaint_id))
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const showLocationComplaint = async (req, res) => {
    try {
        const location_id = req.params.id
        const complaint = await complaintService.showLocationComplaint(location_id)
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const ShowCustomerComplaint = async (req, res) => {
    try {
        const customer_id = req.params.id
        const complaint = await complaintService.ShowCustomerComplaint(Number(customer_id))
        return res.json(complaint)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const ShowMyComplaints = async (req, res) => {
    try {
        const customer_id = req.user.id
        const complaints = await complaintService.ShowMyComplaints(Number(customer_id))
        return res.json(complaints)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const ShowMyLocationComplaints = async (req, res) => {
    try {
        const admin_id = req.user.id
        const complaints = await complaintService.ShowCustomerComplaint(admin_id)
        return res.json(complaints)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}