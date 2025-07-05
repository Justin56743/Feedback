const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function createAuthRouter({ users, nextUserId, JWT_SECRET }) {
    const router = express.Router();

    // Register endpoint
    router.post('/register', async (req, res) => {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: nextUserId(),
            username,
            password: hashedPassword,
            role: role === 'admin' ? 'admin' : 'user'
        };
        users.push(user);
        res.status(201).json({ message: 'User registered successfully.' });
    });

    // Login endpoint
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });

    return router;
}

module.exports = createAuthRouter; 