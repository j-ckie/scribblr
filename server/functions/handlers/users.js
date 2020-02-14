const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const {
    validateSignupData,
    validateLoginData,
    reduceUserDetails
} = require("../util/validators");

exports.signup = (req, res) => {
    let newUser = {
        email: req.body.email,
        handle: req.body.handle,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors); // if information is invalid, stop

    const noImg = "no-image.png";

    let token, userId;

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: "This handle is already taken" });
            } else {
                return firebase.auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;

            let userCreds = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId
            };

            db.doc(`/users/${newUser.handle}`).set(userCreds);
        })
        .then(() => {
            return res.status(201).json({ token }); // auth token
        }).catch(err => {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: "Email is already in use" });
            } else {
                return res.status(400).json({ general: "Something went wrong, please try again" });
            }
        });
}