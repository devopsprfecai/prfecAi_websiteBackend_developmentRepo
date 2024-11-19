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
const PORT =5000;



const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://trafy-websiteclone-865611889264.us-central1.run.app', 'https://trafy-blogclone-865611889264.us-central1.run.app',
        'https://trafy.ai','https://blog.trafy.ai'],

    methods: ['GET', 'POST', 'OPTIONS'], // Include OPTIONS for preflight
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Include necessary headers
    credentials: true, // Important for cookies
    maxAge: 86400, // Cache preflight request results for 24 hours
    exposedHeaders: ['Set-Cookie'], // Allow client to read Set-Cookie header
};

app.use(cors(corsOptions))
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
