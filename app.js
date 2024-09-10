require("dotenv").config();

const express = require('express');
const cors = require('cors');  // Import CORS middleware
const app = express();
var http = require('http').Server(app);

const paymentRoute = require('./routes/paymentRoute');

// Use CORS to allow requests from your frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://trafywebsite-backend-865611889264.us-central1.run.app','https://trafyai.com'], // Allow both local and GCP origins
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));


app.use(express.json()); // To parse JSON bodies
app.use('/api', paymentRoute);

http.listen(5000, function(){
    console.log('Server is running on port 5000');
});
