const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.getUser = functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    if(req.query.uid)
        return admin.auth().getUser(req.query.uid).then((user) => res.json(user.toJSON()));
    else if(req.query.email)
        return admin.auth().getUserByEmail(req.query.email).then((user) => res.json(user.toJSON()));
});