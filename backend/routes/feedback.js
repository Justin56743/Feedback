const express = require('express');

function createFeedbackRouter({ feedbacks, nextId, authenticateToken }) {
    const router = express.Router();

    // POST /api/feedback - Submit new complaint/feedback (user only)
    router.post('/', authenticateToken, (req, res) => {
        const { category, description } = req.body;
        if (!category || !description) {
            return res.status(400).json({ error: 'category and description are required.' });
        }
        const feedback = {
            id: nextId(),
            userId: req.user.id,
            username: req.user.username,
            category,
            description,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        feedbacks.push(feedback);
        res.status(201).json(feedback);
    });

    // GET /api/feedback - List all complaints/feedback
    router.get('/', authenticateToken, (req, res) => {
        if (req.user.role === 'admin') {
            return res.json(feedbacks);
        } else {
            const userFeedbacks = feedbacks.filter(fb => fb.userId === req.user.id);
            return res.json(userFeedbacks);
        }
    });

    // GET /api/feedback/:id - Get a single complaint/feedback
    router.get('/:id', authenticateToken, (req, res) => {
        const id = parseInt(req.params.id);
        const feedback = feedbacks.find(fb => fb.id === id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }
        if (req.user.role !== 'admin' && feedback.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied.' });
        }
        res.json(feedback);
    });

    // PATCH /api/feedback/:id - Update status (admin only) or edit (user, only if open and owner)
    router.patch('/:id', authenticateToken, (req, res) => {
        const id = parseInt(req.params.id);
        const feedback = feedbacks.find(fb => fb.id === id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }
        // Admin can update status, remarks, department
        if (req.user.role === 'admin') {
            const { status, remarks, department } = req.body;
            if (status) {
                if (!['open', 'in-progress', 'resolved', 'rejected'].includes(status)) {
                    return res.status(400).json({ error: 'Invalid status.' });
                }
                feedback.status = status;
            }
            if (remarks !== undefined) feedback.remarks = remarks;
            if (department !== undefined) feedback.department = department;
            return res.json(feedback);
        }
        // User can edit only if open and owner
        if (req.user.id === feedback.userId && feedback.status === 'open') {
            const { category, description } = req.body;
            if (category) feedback.category = category;
            if (description) feedback.description = description;
            return res.json(feedback);
        }
        return res.status(403).json({ error: 'You can only edit your own open complaints.' });
    });

    // DELETE /api/feedback/:id - Delete complaint (user, only if open and owner)
    router.delete('/:id', authenticateToken, (req, res) => {
        const id = parseInt(req.params.id);
        const index = feedbacks.findIndex(fb => fb.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Feedback not found.' });
        }
        const feedback = feedbacks[index];
        if (req.user.id === feedback.userId && feedback.status === 'open') {
            feedbacks.splice(index, 1);
            return res.json({ message: 'Feedback deleted successfully.' });
        }
        return res.status(403).json({ error: 'You can only delete your own open complaints.' });
    });

    return router;
}

module.exports = createFeedbackRouter; 