const express = require('express');
const cors = require('cors');
const app = express();

const JWT_SECRET = 'your_jwt_secret';

// Auth middleware
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided.' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const createAuthRouter = require('./routes/auth');
const createFeedbackRouter = require('./routes/feedback');

app.use('/api', createAuthRouter({ JWT_SECRET }));
app.use('/api/feedback', createFeedbackRouter({ authenticateToken }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/about', (req,res) => {
    res.send('About page');
});

app.get('/contact', (req,res) => {
    res.send('Contact page');
});

const myserver = app.listen(5000, () => {
    console.log('Server is running on port 5000');
});






