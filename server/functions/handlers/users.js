const { admin, db } = require("../util/admin");

const config = require("../util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const {
    validateSignupData,
    validateLoginData,
    reduceUserDetails
} = require("../util/validators");

// ======= user signup =======
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

// =======  user login ======= 
exports.login = (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors); // if invalid, stop

    firebase.auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({ token });
        })
        .catch(err => {
            console.error(err);
            return res.status(403).json({ general: "Wrong credentials, please try again" });
        });
};

// ======= add user profile details ======= 
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: "Details successfully added!" });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// ======= get a user's details ======= 
exports.getUserDetails = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                userData.user = doc.data();
                return db.collection("scribbles")
                    .where("userHandle", "==", req.params.handle)
                    .orderBy("createdAt", "desc")
                    .get();
            } else {
                return res.status(404).json({ error: "User not found!" });
            }
        })
        .then(data => {
            userData.scribbles = [];
            data.forEach(doc => {
                userData.scribbles.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    scribbleId: doc.id
                });
            });
            return res.json(userData);
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};
