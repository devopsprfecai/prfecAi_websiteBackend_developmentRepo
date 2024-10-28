const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

// Initialize Firebase Admin SDK
// Make sure you either use `applicationDefault()` or provide your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // or specify the path to the service account key JSON file
  projectId:'trafyai-loginsignup',
  databaseURL: 'https://trafyai-loginsignup-default-rtdb.firebaseio.com/',
  storageBucket: 'trafyai-loginsignup.appspot.com' 
});

module.exports =
  admin;
  // getAuth: admin.auth,
  // getStorage: admin.storage,
  // database: admin.database(),
