// backend/connections/firebaseconfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Optionally, add databaseURL if you use Realtime Database
});

module.exports = admin;