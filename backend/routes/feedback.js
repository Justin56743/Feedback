const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function createFeedbackRouter({ authenticateToken }) {
    const router = express.Router();

    router.post('/', authenticateToken, async (req, res) => {
        try {
            const { category, description } = req.body;
            if (!category || !description) {
                return res.status(400).json({ error: 'category and description are required.' });
            }
            
            const feedback = await prisma.feedback.create({
                data: {
                    category,
                    description,
                    userId: req.user.id
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            
            res.status(201).json(feedback);
        } catch (error) {
            console.error('Create feedback error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    router.get('/', authenticateToken, async (req, res) => {
        try {
            if (req.user.role === 'admin') {
                const feedbacks = await prisma.feedback.findMany({
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return res.json(feedbacks);
            } else {
                const userFeedbacks = await prisma.feedback.findMany({
                    where: {
                        userId: req.user.id
                    },
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return res.json(userFeedbacks);
            }
        } catch (error) {
            console.error('Get feedbacks error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    router.get('/:id', authenticateToken, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const feedback = await prisma.feedback.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback not found.' });
            }
            
            if (req.user.role !== 'admin' && feedback.userId !== req.user.id) {
                return res.status(403).json({ error: 'Access denied.' });
            }
            
            res.json(feedback);
        } catch (error) {
            console.error('Get feedback error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    router.patch('/:id', authenticateToken, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const feedback = await prisma.feedback.findUnique({
                where: { id }
            });
            
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback not found.' });
            }
            
            if (req.user.role === 'admin') {
                const { status, remarks, department } = req.body;
                const updateData = {};
                console.log('PATCH /api/feedback/:id', { status, remarks, department });
                
                if (status) {
                    if (!['open', 'in-progress', 'resolved', 'rejected'].includes(status)) {
                        return res.status(400).json({ error: 'Invalid status.' });
                    }
                    updateData.status = status;
                }
                if (remarks !== undefined) updateData.remarks = remarks;
                if (department !== undefined) updateData.department = department;
                
                const updatedFeedback = await prisma.feedback.update({
                    where: { id },
                    data: updateData,
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                });
                
                console.log('Updated feedback:', updatedFeedback);
                return res.json(updatedFeedback);
            }
            
            if (req.user.id === feedback.userId && feedback.status === 'open') {
                const { category, description } = req.body;
                const updateData = {};
                
                if (category) updateData.category = category;
                if (description) updateData.description = description;
                
                const updatedFeedback = await prisma.feedback.update({
                    where: { id },
                    data: updateData,
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                });
                
                return res.json(updatedFeedback);
            }
            
            return res.status(403).json({ error: 'You can only edit your own open complaints.' });
        } catch (error) {
            console.error('Update feedback error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    router.delete('/:id', authenticateToken, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const feedback = await prisma.feedback.findUnique({
                where: { id }
            });
            
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback not found.' });
            }
            
            if (req.user.id === feedback.userId && feedback.status === 'open') {
                await prisma.feedback.delete({
                    where: { id }
                });
                return res.json({ message: 'Feedback deleted successfully.' });
            }
            
            return res.status(403).json({ error: 'You can only delete your own open complaints.' });
        } catch (error) {
            console.error('Delete feedback error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    return router;
}

module.exports = createFeedbackRouter; 