const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Payment routes

router.post('/sendSignInEmail', paymentController.sendSignInEmail);





module.exports = router;
