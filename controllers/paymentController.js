const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const axios = require('axios');

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY, GMAIL_USER, GMAIL_PASS } = process.env;




const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host
    port: 465, // Common port for SMTP with STARTTLS
    secure: true, // Set to true for port 465 (SSL), or false for port 587 (STARTTLS)
    auth: {
        user: 'in.trafyai@gmail.com', // Your custom email address
        pass: 'fjll iktm fyuc bzec' // Your email password
    }
});
// console.log('Razorpay Key:', process.env.RAZORPAY_ID_KEY);


const createOrder = async (req, res) => {
    try {
        const { amount, name, description, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ success: false, msg: 'Amount and currency are required' });
        }

        const options = {
            amount: amount, // Amount already in paise from frontend
            currency: currency, // Currency is set dynamically
            receipt: `${Math.floor(Math.random() * 1000000)}`, // Unique receipt ID
            payment_capture: 1, // Auto-capture payments
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).json({
                    success: true,
                    order_id: order.id,
                    amount: amount / 100, // Amount in INR
                    key_id: RAZORPAY_ID_KEY,
                    product_name: name,
                    description: description,
                    currency: currency,
                });
            } else {
                console.error('Error creating order:', err);
                res.status(400).json({ success: false, msg: 'Something went wrong!' });
            }
        });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};



const sendEmailNotification = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: "in.trafyai@gmail.com",
            to: email,
            subject: subject,
            text: message
        });
        // console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Controller function to handle sending email after payment
const sendPaymentEmail = async (req, res) => {
    try {
        const { email, paymentStatus } = req.body;
        

        let subject, message;

        if (paymentStatus === 'success') {
            subject = 'Payment Successful';
            message = 'Payment is collected. Thanks for submitting the form, we will reach out to you soon.';
        } else {
            subject = 'Payment Failed';
            message = 'Unfortunately, the payment failed. Please try again.';
        }

        // Send the email
        await sendEmailNotification(email, subject, message);

        res.status(200).json({ success: true, msg: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, msg: 'Failed to send email' });
    }
};

module.exports = {
    createOrder,
    sendPaymentEmail,
};
