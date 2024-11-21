require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('./firebaseAdmin');

const app = express();
const PORT = process.env.PORT || 6000;

// Comprehensive CORS configuration
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'https://trafy-websiteclone-865611889264.us-central1.run.app', 
    'https://trafy-blogclone-865611889264.us-central1.run.app', 
    'https://trafy.ai', 
    'https://blog.trafy.ai',
    'https://trafy-newbackend-255821839155.us-central1.run.app' // Add your backend origin
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie', 
        'X-Requested-With', 
        'Origin', 
        'Accept'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Custom CORS headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    }
    
    next();
});

// Routes
const paymentRoute = require('./routes/paymentRoute');
app.use('/api', paymentRoute);

// Session verification middleware
app.use(async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';
    
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;