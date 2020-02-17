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
    getUserDetails,
    uploadPfp,
    addUserDetails
    // getCurrentUser,
    // markNotificationsRead
} = require("./handlers/users")

// scribble routes
app.get("/scribbles", viewAllScribbles);
app.post("/scribble", fbAuth, postOneScribble);
app.get("/scribble/:scribbleId", getScribble);
// app.delete("/scribble/:ScribbleId", fbAuth, deleteScribble);
app.get("/scribble/:scribbleId/like", fbAuth, likeScribble);
app.get("/scribble/:scribbleId/unlike", fbAuth, unlikeScribble);
app.post("/scribble/:scribbleId/comment", fbAuth, commentOnScribble);

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/", fbAuth, addUserDetails);
app.get("/user/:handle", fbAuth, getUserDetails);
app.post("/user/image", fbAuth, uploadPfp)
// app.post("/user", fbAuth, getCurrentUser);
// app.post("/notifications", fbAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
    .region("us-central1")
    .firestore.document("likes/{id}")
    .onCreate(snapshot => {
        return db
            .doc(`/scribbles/${snapshot.data().scribbleId}`)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle != snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: "like",
                        read: false,
                        scribbleId: doc.id
                    });
                }
            })
            .catch(err => console.error(err));
    });

exports.deleteNotificationOnUnlike = functions
    .region("us-central1")
    .firestore.document("likes/{id}")
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
                return;
            });
    });

exports.createNotificationOnComment = functions
    .region("us-central1")
    .firestore.document("comments/{id}")
    .onCreate(snapshot => {
        return db.doc(`/scribbles/${snapshot.data().scribbleId}`)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle != snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: "comment",
                            read: false,
                            scribbleId: doc.id
                        });
                }
            }).catch(err => {
                console.error(err);
                return;
            })
    });


// firebase serve --only functions,firestore
