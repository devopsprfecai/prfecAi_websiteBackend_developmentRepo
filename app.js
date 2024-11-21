require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');  // To parse cookies
const app = express();
var http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');
const paymentController=require('./controllers/paymentController');

// Firebase Admin
const admin = require('./firebaseAdmin');
const PORT =6000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://trafy-websiteclone-865611889264.us-central1.run.app',
    'https://trafy-blogclone-865611889264.us-central1.run.app',
    'https://trafy.ai',
    'https://blog.trafy.ai',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Preflight requests

app.use(cookieParser());  // Parse cookies
app.use(express.json());  // To parse JSON bodies

app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    next();
});

app.use('/api', paymentRoute);


// Middleware to verify session cookies
app.use(async (req, res, next) => {
    const sessionCookie = req.cookies.session || ''; // Get session cookie
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;  // Attach user information to request
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
