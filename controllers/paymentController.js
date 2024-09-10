const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

console.log('Razorpay Key:', process.env.RAZORPAY_ID_KEY);


const createOrder = async (req, res) => {
    try {
        const { amount, name, description, type } = req.body;

        // Define the receipt prefix based on the type of payment (MasterClass or Course)
        const receiptPrefix = type === "masterclass" ? "MC" : "COURSE";

        // Prepare Razorpay order options
        const options = {
            amount: amount * 100, // Razorpay requires the amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: `${receiptPrefix}_${Math.floor(Math.random() * 100000)}`, // Unique receipt ID
            payment_capture: 1 // Auto-capture payments after successful payment
        };

        // Create the Razorpay order
        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).json({
                    success: true,
                    order_id: order.id,
                    amount: amount * 100, // Amount in paise
                    key_id: RAZORPAY_ID_KEY,
                    product_name: name,
                    description: description,
                    type: type // Send the type back to the frontend for confirmation
                });
            } else {
                res.status(400).json({ success: false, msg: 'Something went wrong!' });
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};

module.exports = {
    createOrder
};
