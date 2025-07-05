const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function createAuthRouter({ JWT_SECRET }) {
    const router = express.Router();

    // Register endpoint
    router.post('/register', async (req, res) => {
        try {
            const { username, password, role } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }
            
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { username }
            });
            
            if (existingUser) {
                return res.status(400).json({ error: 'Username already exists.' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: role === 'admin' ? 'admin' : 'user'
                }
            });
            
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    // Login endpoint
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { username }
            });
            
            if (!user) {
                return res.status(400).json({ error: 'Invalid username or password.' });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid username or password.' });
            }
            
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role }, 
                JWT_SECRET, 
                { expiresIn: '1h' }
            );
            
            res.json({ token });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    });

    return router;
}

module.exports = createAuthRouter; 