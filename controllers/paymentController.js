const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const { GMAIL_USER, GMAIL_PASS } = process.env;
const { auth, firestore } = require('../utils/firebaseAdmin');


const admin = require('firebase-admin');

// const razorpayInstance = new Razorpay({
//     key_id: RAZORPAY_ID_KEY,
//     key_secret: RAZORPAY_SECRET_KEY
// });


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host
    port: 465, // Common port for SMTP with STARTTLS
    secure: true, // Set to true for port 465 (SSL), or false for port 587 (STARTTLS)
    auth: {
        user: 'info@prfec.ai', // Your custom email address
        pass: 'zwap nfow xtiu fpiy' // Your email password
    }
});
// console.log('Razorpay Key:', process.env.RAZORPAY_ID_KEY);






const sendEmailNotification = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: '"Your Project Team" <info@prfec.ai>',
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
const sendSignInEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, msg: 'Email is required' });
    }

    try {
        // Generate the email sign-in link using Firebase Admin SDK
        const actionCodeSettings = {
            url: `${process.env.FRONTEND_URL}/login?email=${encodeURIComponent(email)}`,
            handleCodeInApp: true,
        };
        const link = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

        // URL of the logo
        const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/prfecai-auth.firebasestorage.app/o/Prfec%20Logo%20White.png?alt=media&token=99410079-cdfe-4d04-bc83-c488b3d26916';

        // Send custom sign-in email with Nodemailer
        const mailOptions = {
            from: '"Your Project Team" <info@prfec.ai>',
            to: email,
            subject: 'Sign In to Your Account',
            html: `
            <html>
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">                   
                    <style>
                        body {
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #000000; /* Black background */
                            color: #ffffff; /* White text */
                            border-radius: 8px;
                            text-align: center;
                        }
                        .button {
                            background-color: #ffffff; /* White button background */
                            color: #000000; /* Black text on the button */
                            border: none;
                            border-radius: 8px;
                            padding: 12px 24px;
                            text-decoration: none;
                            font-size: 15px;
                            margin: 0;
                            display: inline-block;
                            font-weight: 500;
                            cursor: pointer;
                            font-family:"Inter",serif;
                        }
                        .email-container img {
                            margin: 20px auto; /* Center image */
                            max-width: 120px; /* Limit image size */
                            display: block; /* Ensure it's block-level for centering */
                            border: none; /* Remove default border */
                        }
                        h1{
                            margin-top:40px;
                            font-size:24px;
                            font-weight:600;
                            color:white;
                            font-family:"Inter",serif;

                            }
                        p {
                            margin-top:10px;
                            margin-bottom:40px;
                            font-size: 14px;
                            color:#d1d1d1;
                            font-family:"Inter",serif;

                        }
                    </style>
                </head>
                <body>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; padding: 20px;">
                        <tr>
                            <td align="center">
                                <div class="email-container">
                                    <img src="${logoUrl}" alt="Logo">
                                    <h1>Let's get you signed in</h1>
                                    <p>All you have to do is click this button and we'll sign you in with a secure link</p>
                                    <a href="${link}" class="button" style="color:black;">Sign in to prfec</a>
                                    <p style="font-size:13px;color:#d1d1d1;font-weight:400;margin: 40px 0;">If you did not request this email, you can safely ignore it.</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, msg: 'Custom sign-in email sent successfully' });
    } catch (error) {
        console.error('Error in sendSignInEmail:', error);
        res.status(500).json({ success: false, msg: 'Failed to send sign-in email' });
    }
};
module.exports = {

    sendSignInEmail,
    sendEmailNotification

};
