const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY, GMAIL_USER, GMAIL_PASS } = process.env;



const admin = require('../firebaseAdmin');


const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host
    port: 465, // Common port for SMTP with STARTTLS
    secure: true, // Set to true for port 465 (SSL), or false for port 587 (STARTTLS)
    auth: {
        user: 'info@trafyai.com', // Your custom email address
        pass: 'ifcy tffc tbai kgtx' // Your email password
    }
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

const sendEmailNotification = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: "info@trafyai.com",
            to: email,
            subject: subject,
            text: message
        });
        console.log('Email sent successfully');
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



const createSessionCookie = async (req, res) => {
    const { idToken } = req.body;
    // console.log(idToken)  
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
        global.sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        console.log(global.sessionCookie)

        // Set cookie options
        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true, // Always use secure in production
            sameSite: 'None',
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.trafy.ai' : 'localhost'
        };
        res.cookie('session', sessionCookie, options);
        
        // Set CORS headers explicitly
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        
        res.status(200).json({ success: true, message: 'Session cookie created successfully' });
        
    } catch (error) {
        console.error('Error creating session cookie:', error);
        res.status(401).send('Unauthorized request');
    }
};



const bucket = admin.storage().bucket();

const getSessionCookie = async (req, res) => {
    try {
        const session =  global.sessionCookie;; // Read the session cookie from request headers
        console.log("Session value:", session);
        if (!session) {
            return res.status(401).json({ success: false, message: 'No session cookie found' });
        }

        const decodedClaims = await admin.auth().verifySessionCookie(session, true);
        const uid = decodedClaims.uid; 
        console.log("Decoded UID:", uid);

        // Access Realtime Database with admin SDK to fetch user data (email, firstname)
        const userRef = admin.database().ref('usersData/' + uid);
        const snapshot = await userRef.once('value');

        if (!snapshot.exists()) {
            console.log(`No user data found for UID ${uid}`);
            return res.status(404).json({ success: false, message: 'User data not found' });
        }

        const userData = snapshot.val();
        const email = userData.email;
        const firstName = userData.firstName;

        console.log(`User's email: ${email}`);
        console.log(`User's firstname: ${firstName}`);

        // Specify the path in Firebase Storage where the user's profile picture is stored
        const fileName = `profilePictures/${uid}/`;  // Construct the file path

        // List files in the user's folder
        const [files] = await bucket.getFiles({
            prefix: fileName,  // Get all files with this prefix (i.e., in the folder)
        });

        // Check if there are files in the folder
        if (files.length === 0) {
            console.log(`No image found for user ${uid}`);
            return res.status(404).json({ success: false, message: 'No profile picture found' });
        }

        // Assuming the first file is the user's image
        const file = files[0];  // Get the first file (or choose based on your logic)
        const filename = file.name;  // This is the full path to the file

        // Encode the file path to make it URL-friendly
        const encodedFilePath = encodeURIComponent(filename);

        // Construct the public download URL
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilePath}?alt=media`;

        console.log(`Public URL for user ${uid}: ${publicUrl}`);
        
        // Return the public URL and user data as part of the response to be accessed by the client
        return res.status(200).json({
            success: true,
            profilePicURL: publicUrl,
            email: email,
            firstName: firstName,
            session:session,
        });

    } catch (err) {
        console.error('Error fetching user data or image:', err);
        return res.status(500).json({ success: false, message: 'Error fetching user data or image' });
    }
};




const verifyToken = async (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log(decodedToken); // Log for debugging

        // Send back user info
        res.status(200).json({ uid: decodedToken.uid, email: decodedToken.email });
    } catch (error) {
        console.error('Error verifying token:', error); // Log the error
        res.status(401).json({ error: 'Invalid token' });
    }
};

const clearSessionCookie = async (req, res) => {
    try {
        const { clearSession } = req.body;

        // Check if session cookie exists in the request headers
        const sessionCookie = req.cookies.session;
        if (!sessionCookie) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No session cookie found' });
        }

        // If the request is asking to clear the session
        if (clearSession) {
            // Clear the session cookie
            res.clearCookie('session', { path: '/' });
            return res.status(200).json({ success: true, message: 'Session cookie cleared' });
        }

        return res.status(400).json({ success: false, message: 'Invalid request' });
    } catch (err) {
        console.error('Error clearing session cookie:', err);
        return res.status(500).json({ success: false, message: 'Failed to clear session cookie' });
    }
};


module.exports = {
    createOrder,
    sendPaymentEmail,
    createSessionCookie,
    getSessionCookie,
    clearSessionCookie,
    verifyToken, // Don't forget to export this function
};