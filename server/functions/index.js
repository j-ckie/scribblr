// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// express
const express = require("express"); // requires and calls express in one line
const app = express();

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
    viewAllScribbles,
    postOneScribble,
    getScribble,
    commentOnScribble,
    likeScribble,
    unlikeScribble
    // deleteScribble
} = require("./handlers/scribbles")

// user handlers
const {
    signup,
    login,
    getUserDetails
    // uploadPfp,
    // addUserDetails,
    // getAuthUser,
    // markNotificationsRead
} = require("./handlers/users")

// scribble routes
app.get("/scribbles", viewAllScribbles);
app.post("/scribble", fbAuth, postOneScribble);
app.get("/scribble/:scribbleId", getScribble);
// app.delete("/scribble/:ScribbleId", fbAuth, deleteScribble);
app.get("/scribble/:scribbleId/like", fbAuth, likeScribble);
app.post("/scribble/:scribbleId/unlike", fbAuth, unlikeScribble);
app.post("/scribble/:scribbleId/comment", fbAuth, commentOnScribble);

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/user/:handle", getUserDetails);
// app.get("/user", fbAuth, getAuthUser);
// app.post("/user/image", fbAuth, uploadPfp);
// app.post("/user", fbAuth, addUserDetails);
// app.post("/notifications", fbAuth, markNotificationsRead);



exports.api = functions.https.onRequest(app);