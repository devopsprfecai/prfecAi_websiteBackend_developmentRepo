const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: "trafyai-loginsignup",
  private_key_id: "65daba5dbeae113e7d5fd13cfb3f5b6f928f9685",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD5WTne60wLCLep\nKqhE4koYuzPEY3niC6pwjO9VuEvGNzgQMkkFQShK9gLq3Y4+L4F8rKXqtnOsolSO\np4lZUtlhveR8CTLatGIDJNyTP/JtsKMazAoczWLKki7R1y5S4a0USSxjKFEpLZv6\n/g3eR0GEOTZf8+LXFfmxdjsczU3w8km8CCB+2szXYuXswMaF9N9n3mie3MjnJSGP\n6MPWuV2EedP28gj414ZkYTDAwZTdOqc9iULySS4PwhCQbz/vAFrbaBcdSZFFgr2a\nMI7aDfsRGi0Dk31juD4hsnrFSl96TJErSnNuSYoid7Wu38ng0Onj7ONhwJzQVMC2\n/zWEwjmtAgMBAAECggEAGz5Y+Na7lb8LlhOfk/snfmFBzDTUNdLxed+kLLj4qn0R\nBo//82+Fj/8mHXQ8nOXC35TbgfQSWmvYEkgS1SwcrTW6t6SnpkasKMzHvtzvR3XT\ntFNTzYbRQvHK5Ml+ebbHmt5N172pdHbTwo4shLtDWMeJfd1fTQHNKMsStVhnKiqP\nlxN1okWcWpK0Ixlyek/cEEGcroUH/RbwzYlA48ptAPu7tJyeYW+puZTgqwFYAqLK\nTQ6ff9I6ESs/Fl3V22VoOuiD3dU3TAOiOGg0vkczkRzr4epdJxXJzAui3Mkyb3iG\nCKiP6W8iutcia7AcMHfqoHzWcqVT3L9FjnV+PexrHwKBgQD9P8ku2lr1+x4qpJna\n2883uY5T0ZIjeRO19PnZw55hxCxKK6+y4hdg02OyUNChNgGvZwpya3QpjXa+9rUw\n3sG5K141HPnphhlRpVOmhBGvNJ9QS3sWm6FgTgAIwHlkZyN8DwnHkg/r19sa00TI\nNVSH2mFs4uzlFNNz+VjgxvoQBwKBgQD8Dpf523Dj/hr75GbcFeQAYHB5eVbImvTy\nrQobLZF4y8VMt763eXoxWw4cCPCu3iBa9wOl4H1ATrF86N2tatR69RD80gcTHqOQ\nPjXMfGKEFmFV7FZtoT9Ju0NeQDvH8aUNIZgU6q9XwRRvbQY/hHob/DqBZnhjxFS5\ndBa+uu8TqwKBgQCvJEnyiTiXHZCDVUrCPXpVw5JXDXzP45BqKn4QyGTkoFMxCH1+\nbTZV1FwCmjlvBHat48kp0H6JrjgNYXl1ztiTQxboDJ4ZjpA8EuaDJptEXFRBp7H8\ntK0qeUc0xkgt09aKmavdxXoVVTdGmg3bmGZZfgIa1+WVmI2Ui0GYUoPmSQKBgBZK\npB4wzhcbzf8hAAfO189AuDHGDWrIaYlczFwC966bNuPGDFPlpmzfBKxuDfspIetp\nlSUCaZFaZFALuC8yF4CYU9xIJuAGAaksF03yYjQUVp9mu24OqK44pYicXa0dLd+v\nbOfMqZ01Mj14gujzKml3MSVojpUkM+oC3lAX8DTpAoGAX5xKGPLWWcyERCWv7FRp\nlCn51RhVL02tGQ0O6AGamotPRERqed6alMWzUIDXyY+Zr2WO88kbrKaIrj3Bmvmg\nrZ25za4674xou3694N9Vb0EBMvgBmapBBQR1FqCLJHitqJzoEndX5m+YhLhwl176\nVHUMJoW2z7S4vToywSMjdWI=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-z1u6q@trafyai-loginsignup.iam.gserviceaccount.com",
  client_id: "113003544581337191932",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-z1u6q%40trafyai-loginsignup.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
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
