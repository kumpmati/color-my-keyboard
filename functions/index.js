const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const docRef = admin.firestore().collection('keyboard-colors').doc('current');

exports.setColor = functions.https.onCall(async data => {
    console.log(data);
    return data;
});