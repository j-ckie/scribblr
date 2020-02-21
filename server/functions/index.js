// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// express
const express = require("express"); // requires and calls express in one line
const app = express();

// const cors = require("cors")

// app.use(cors())({ origin: true });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
    unlikeScribble,
    deleteScribble,
    updateScribble,
    deleteComment
} = require("./handlers/scribbles")

// user handlers
const {
    signup,
    login,
    getUserDetails,
    uploadPfp,
    addUserDetails,
    getCurrentUser,
    markNotificationsRead
} = require("./handlers/users")

// scribble routes
app.get("/scribbles", viewAllScribbles);
app.post("/scribble", fbAuth, postOneScribble);
app.get("/scribble/:scribbleId", getScribble);
app.get("/scribble/:scribbleId/like", fbAuth, likeScribble);
app.get("/scribble/:scribbleId/unlike", fbAuth, unlikeScribble);
app.post("/scribble/:scribbleId/comment", fbAuth, commentOnScribble);
app.delete("/scribble/:scribbleId", fbAuth, deleteScribble);
app.post("/scribble/:scribbleId/update", fbAuth, updateScribble);
app.delete("/scribble/:scribbleId/comment/:commentId", fbAuth, deleteComment)

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user", fbAuth, addUserDetails);
app.get("/user/:handle", getUserDetails); // public route
app.post("/user/image", fbAuth, uploadPfp)
app.get("/user", fbAuth, getCurrentUser); // private personal route for account
app.post("/notifications", fbAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
    .region("us-central1")
    .firestore.document("likes/{id}")
    .onCreate(snapshot => {
        return db
            .doc(`/scribbles/${snapshot.data().scribbleId}`)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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

exports.deleteNotificationOnCommentDelete = functions
    .region("us-central1")
    .firestore.document("comments/{id}")
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err);
                return;
            })
    })

// if user changes pfp - change all pics on scribbles
exports.onUserImgChange = functions
    .region("us-central1")
    .firestore.document("/users/{userId}")
    .onUpdate(change => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            let batch = db.batch();
            console.log("Image has changed")
            return db.collection("scribbles").where("userHandle", "==", change.before.data().handle).get()
                .then(data => {
                    data.forEach(doc => {
                        const scribble = db.doc(`/scribbles/${doc.id}`);
                        batch.update(scribble, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                });
        } else return true;
    });

exports.onScribbleDelete = functions
    .region("us-central1")
    .firestore.document("/scribbles/{scribbleId}")
    .onDelete((snapshot, context) => {
        const scribbleId = context.params.scribbleId;
        const batch = db.batch();

        return db
            .collection("comments")
            .where("scribbleId", "==", scribbleId)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db
                    .collection("likes")
                    .where("scribbleId", "==", scribbleId)
                    .get()
                    .then(data => {
                        data.forEach(doc => {
                            batch.delete(db.doc(`/likes/${doc.id}`));
                        })
                        return db
                            .collection("notifications")
                            .where("scribbleId", "==", scribbleId)
                            .get()
                            .then(data => {
                                data.forEach(doc => {
                                    batch.delete(db.doc(`/notifications/${doc.id}`));
                                })
                                return batch.commit(); // ends the deletion of all related collections
                            }).catch(err => console.error(err))
                    })
            })
    })

// firebase serve --only functions,firestore
