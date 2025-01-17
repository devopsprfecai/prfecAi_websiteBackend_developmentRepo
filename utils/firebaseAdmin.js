const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Initialize the Secret Manager client
const secretClient = new SecretManagerServiceClient();

// Function to access a secret
async function accessSecret(name) {
    const [version] = await secretClient.accessSecretVersion({ name });
    return version.payload.data.toString();
}

// Firebase initialization promise
const firebaseInitPromise = (async () => {
    if (!admin.apps.length) {
        const FIREBASE_PROJECT_ID = await accessSecret('projects/592134571427/secrets/FIREBASE_PROJECT_ID/versions/1');
        const FIREBASE_CLIENT_EMAIL = await accessSecret('projects/592134571427/secrets/FIREBASE_CLIENT_EMAIL/versions/1');
        const FIREBASE_PRIVATE_KEY = await accessSecret('projects/592134571427/secrets/FIREBASE_PRIVATE_KEY/versions/1');

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

// Export a wrapper for Firebase services to ensure initialization
const getFirebaseServices = async () => {
    await firebaseInitPromise;
    return {
        admin,
        auth: admin.auth(),
        firestore: admin.firestore(),
    };
};

module.exports = getFirebaseServices;
