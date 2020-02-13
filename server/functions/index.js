// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// express
const app = require("express")(); // requires and calls express in one line

// firebase functions setup
const functions = require("firebase-functions");

// firebase authentication
const fbAuth = require("./util/fbAuth");

// fb admin setup
const {
    db,
    admin
} = require("./util/admin");

// prepackaged res test
// exports.helloWorld = functions.https.onRequest((req, res) => {
//     res.send("Hello from Firebase!");
// });

// scribble handlers
const {
    viewAllScribbles
    // postOneScribble,
    // getScribble,
    // commentOnScribble,
    // likeScribble,
    // unlikeScribble,
    // deleteScribble
} = require("./handlers/scribbles")

// user handlers
/* const {
    signup,
    login,
    uploadPfp,
    addUserDetails,
    getAuthUser,
    GetUserDetails,
    markNotificationsRead
} = require("./handlers/users") */

// scribble routes
app.get("/scribbles", viewAllScribbles);
// app.post("/scribble", postOneScribble);
// app.get("/scribble/:scribbleId", getScribble);
// app.delete("/scribble/:ScribbleId", deleteScribble);
// app.get("/scribble/:scribbleId/like", likeScribble);
// app.post("/scribble/:scribbleId/unlike", unlikeScribble);
// app.post("/scribble/:scribbleId/comment")

// user routes
// app.post("/signup", signup);
// app.post("/login", login);
// app.get("/user", fbAuth, getAuthUser);
// app.post("/user/image", fbAuth, uploadPfp);
// app.post("/user", fbAuth, addUserDetails);
// app.get("/user/:handle", getUserDetails);
// app.post("/notifications", fbAuth, markNotificationsRead);


exports.viewAllScribbles = functions.https.onRequest((req, res) => {
    admin.firestore().collection("scribbles").get()
        .then(data => {
            let scribbles = [];

            data.forEach(doc => {
                scribbles.push(doc.data());
            })
            return res.json(scribbles);
        }).catch(err => console.error(err));
})
