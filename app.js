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
const PORT = 6000;

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://trafy.ai',
        'https://blog.trafy.ai'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods'
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};


app.use(cors(corsOptions));
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.header('origin') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
});

app.use(cookieParser());  // Parse cookies
app.use(express.json());  // To parse JSON bodies
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
