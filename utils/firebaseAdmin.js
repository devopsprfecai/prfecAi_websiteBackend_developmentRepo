const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccount.json');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Ensure Firebase Admin SDK is initialized only once
const secretClient = new SecretManagerServiceClient();

async function accessSecret(name) {
    const [version] = await secretClient.accessSecretVersion({ name });
    return version.payload.data.toString();
}

(async () => {
    if (!admin.apps.length) {
        const FIREBASE_PROJECT_ID = await accessSecret('projects/592134571427/secrets/FIREBASE_PROJECT_ID/versions/1');
        const FIREBASE_CLIENT_EMAIL = await accessSecret('projects/592134571427/secrets/FIREBASE_CLIENT_EMAIL/versions/1');
        const FIREBASE_PRIVATE_KEY = await accessSecret('projects/592134571427/secrets/FIREBASE_PRIVATE_KEY/version/1');

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                clientEmail: FIREBASE_CLIENT_EMAIL,
                privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
    }
})();

const auth = admin.auth();
const firestore = admin.firestore();

module.exports = { admin, auth, firestore };

module.exports = { admin, auth, firestore };
