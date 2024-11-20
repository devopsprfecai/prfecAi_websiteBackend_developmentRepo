const admin = require('firebase-admin');

const serviceAccount = {
  // type: "service_account",
  // project_id: "trafyai-loginsignup",
  // private_key_id: "65daba5dbeae113e7d5fd13cfb3f5b6f928f9685",
  // private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD5WTne60wLCLep\nKqhE4koYuzPEY3niC6pwjO9VuEvGNzgQMkkFQShK9gLq3Y4+L4F8rKXqtnOsolSO\np4lZUtlhveR8CTLatGIDJNyTP/JtsKMazAoczWLKki7R1y5S4a0USSxjKFEpLZv6\n/g3eR0GEOTZf8+LXFfmxdjsczU3w8km8CCB+2szXYuXswMaF9N9n3mie3MjnJSGP\n6MPWuV2EedP28gj414ZkYTDAwZTdOqc9iULySS4PwhCQbz/vAFrbaBcdSZFFgr2a\nMI7aDfsRGi0Dk31juD4hsnrFSl96TJErSnNuSYoid7Wu38ng0Onj7ONhwJzQVMC2\n/zWEwjmtAgMBAAECggEAGz5Y+Na7lb8LlhOfk/snfmFBzDTUNdLxed+kLLj4qn0R\nBo//82+Fj/8mHXQ8nOXC35TbgfQSWmvYEkgS1SwcrTW6t6SnpkasKMzHvtzvR3XT\ntFNTzYbRQvHK5Ml+ebbHmt5N172pdHbTwo4shLtDWMeJfd1fTQHNKMsStVhnKiqP\nlxN1okWcWpK0Ixlyek/cEEGcroUH/RbwzYlA48ptAPu7tJyeYW+puZTgqwFYAqLK\nTQ6ff9I6ESs/Fl3V22VoOuiD3dU3TAOiOGg0vkczkRzr4epdJxXJzAui3Mkyb3iG\nCKiP6W8iutcia7AcMHfqoHzWcqVT3L9FjnV+PexrHwKBgQD9P8ku2lr1+x4qpJna\n2883uY5T0ZIjeRO19PnZw55hxCxKK6+y4hdg02OyUNChNgGvZwpya3QpjXa+9rUw\n3sG5K141HPnphhlRpVOmhBGvNJ9QS3sWm6FgTgAIwHlkZyN8DwnHkg/r19sa00TI\nNVSH2mFs4uzlFNNz+VjgxvoQBwKBgQD8Dpf523Dj/hr75GbcFeQAYHB5eVbImvTy\nrQobLZF4y8VMt763eXoxWw4cCPCu3iBa9wOl4H1ATrF86N2tatR69RD80gcTHqOQ\nPjXMfGKEFmFV7FZtoT9Ju0NeQDvH8aUNIZgU6q9XwRRvbQY/hHob/DqBZnhjxFS5\ndBa+uu8TqwKBgQCvJEnyiTiXHZCDVUrCPXpVw5JXDXzP45BqKn4QyGTkoFMxCH1+\nbTZV1FwCmjlvBHat48kp0H6JrjgNYXl1ztiTQxboDJ4ZjpA8EuaDJptEXFRBp7H8\ntK0qeUc0xkgt09aKmavdxXoVVTdGmg3bmGZZfgIa1+WVmI2Ui0GYUoPmSQKBgBZK\npB4wzhcbzf8hAAfO189AuDHGDWrIaYlczFwC966bNuPGDFPlpmzfBKxuDfspIetp\nlSUCaZFaZFALuC8yF4CYU9xIJuAGAaksF03yYjQUVp9mu24OqK44pYicXa0dLd+v\nbOfMqZ01Mj14gujzKml3MSVojpUkM+oC3lAX8DTpAoGAX5xKGPLWWcyERCWv7FRp\nlCn51RhVL02tGQ0O6AGamotPRERqed6alMWzUIDXyY+Zr2WO88kbrKaIrj3Bmvmg\nrZ25za4674xou3694N9Vb0EBMvgBmapBBQR1FqCLJHitqJzoEndX5m+YhLhwl176\nVHUMJoW2z7S4vToywSMjdWI=\n-----END PRIVATE KEY-----\n",
  // client_email: "firebase-adminsdk-z1u6q@trafyai-loginsignup.iam.gserviceaccount.com",
  // client_id: "113003544581337191932",
  // auth_uri: "https://accounts.google.com/o/oauth2/auth",
  // token_uri: "https://oauth2.googleapis.com/token",
  // auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-z1u6q%40trafyai-loginsignup.iam.gserviceaccount.com",
  // universe_domain: "googleapis.com"

  type: "service_account",
  project_id: "trafyai-loginsignup",
  private_key_id: "eb07c7fbd8a210fd87edaa7840e9b1a257f403ad",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6GA4eK+tali9E\nwLK9uFPw9WK04xy8y1B85yj1/rg20b0ML88ORsoSqCvxAnuoNRPqNweIWF4zvRhI\n2BI8opsDdJ4Vgl9mhMfHpoVtoOZ+JnClgiaav8WkQE+ROtns8/8XGpsYFKjchnft\n0IAcNJZn7KawVtMUbjPgXZGAWS9s7+uT5Xkjai/zYOHOwWGa3ezrGjJnQFY7pT9P\nR6R+6m0o8YtDOTp24cwNn7imkl6+t17rYA69ZCtiz+pbi9Xv1y+FWrJqPu2ruGIM\nrGAeAd9Vp7arycH3H6g8SaPAAb+2ZnnZTKXfPNDYpB5dgMhDAojTI5dkOAVvVpqg\nRhWMVWBhAgMBAAECggEAWu4cH+QH+Vh/OlIKRKfH5GqS055R0XJrHsz499KCAs9T\nV5wYyXoPjTQ9XGOBNrzQwVYoSRgc150jO5zQtG4j3nliMVJl+TsSP1z/v4Sqe6Oe\n0VCaOm1QTqTZ/DXMfHrw/0IR3J9jr3XJLhv+LUoI4DkDbhDOzSHYGV6/FP7/LHPt\nlkefElPJjp7c3xxdBrj/C8AxaNVeustFxrdy+rdLvFlnwI0M87bdLSn5nFVRCc39\nWnj4NP3TSmErPm6z7rrFhYSWKMP2DpmeENsK3LygovOwsy/iZVtVTnR6JjpWAIM8\nUghKI8dFnAIyAyWQFGCybtfOtioJlN3N98L5KrcszQKBgQDk3oPV+Ei/KpQNeIGA\nTPcfTtyIGLjEA2Txp+rDiZIcC/3c1wTnRlsFFI2Ot3BuLl/wqraSj21nIYFTCfmL\nd6+RrwBnJf64Cl0E9WHIuajmH/bqKME1TXZO+tb6hyQXjLFV1YknUSpe+OELL//a\ndSS/8Wt+GsNd2qVF46+gBZ4SWwKBgQDQJ3EWY9vmQ8GiMG1FNz7kyaV2HK/p5j8A\n8vBNn3n8K0KuA+vB0OBvBRnhS70UyvaSLt1AHGydm/dWOYBNCDShEprDIzvMTzwJ\nbWWIxbKaISKBAdFN9DGxf3gTiDaC3OmyPQN8qvO2OQLswzs9v0dTi7UAJS4E+HEh\nZqp8Olgc8wKBgQCWifIHdKdM7pGxhpkPrhBCDJor/q7RZzYnaX6WnU94mT6i2t+D\nzBgkcE9oFyqhnmlGoNMz9ZlNY5Fv8DiuzsuxtH08W5Z+sXpbv5dQ8yWwMEg13xau\nm8P80StEYE2SG92tCqaLMO0AyQ0lUa4loDXK9t3wdWQZwK5DGS80v10ozwKBgCl/\nA2tsQuVXsp1rvAzlY5Nmo6a1N1iQvxSoWcGPvljIIwXf4DsGMgfP44XnfG1NvPQN\nhawHPpv5AMjes7YnoZ5OwC2Qs5YaYaSbe3dVujJB0sgXHavFt7Zj7AMwz3UtJyWS\nRkSvK+Cy4uNiVEgN/uEn49CAmPkCskLvXaNgWjqDAoGAQmxdHzpTiC7D4gNAm2/4\nmMGO1itYaoz9d7PIpSSJbc+UXrJAm6pQoq5O5yhpNwIzic5HSOIbTTQT1qVp+c4R\nl1fqCueWhrEQ6PI/buPA6WVRLTsBvzEHb9m694BPprg9r7YIbME6g9uz1CNPG4in\nZ9angj71P6dIYcaKkS7HNKU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-qfyal@trafyai-loginsignup.iam.gserviceaccount.com",
  client_id: "104265320413771208445",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qfyal%40trafyai-loginsignup.iam.gserviceaccount.com",
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
