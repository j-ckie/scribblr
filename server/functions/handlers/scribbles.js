const { db } = require("../util/admin");

// ======= view all scribbles =======
exports.viewAllScribbles = (req, res) => {
    db.collection("scribbles").get()
        .then(data => {
            let scribbles = [];

            data.forEach(doc => {
                scribbles.push({
                    scribbleId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    userImage: doc.data().userImage
                });
            });
            return res.json(scribbles)
        }).catch(err => console.error(err));
}

// ======= post one scribble =======
exports.postOneScribble = (req, res) => {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Method not allowed!" })
    }

    let newScribble = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        // userImage: req.body.userImage, // disabled until I implement default userImage
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
    };

    db.collection("scribbles") // look for the scribbles "table"
        .add(newScribble)
        .then(doc => {
            let resScribble = newScribble; // RESponse scribble
            resScribble.scribbleId = doc.id;
            res.json({ resScribble })
        }).catch(err => console.error(err));
};

// ======= get one specific scribble =======
exports.getScribble = (req, res) => {
    let scribbleData = {};

    db.doc(`/scribbles/${req.params.scribbleId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Scribble not found!" });
            }

            scribbleData = doc.data();
            scribbleData.scribbleId = doc.id;

            return db.collection("comments")
                .orderBy("createdAt", "desc")
                .where("scribbleId", "==", req.params.scribbleId)
                .get();
        })
        .then(data => {
            scribbleData.comments = [];
            data.forEach(doc => {
                scribbleData.comments.push(doc.data());
            });
            return res.json(scribbleData);
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// ======= add comment to scribble =======
exports.commentOnScribble = (req, res) => {
    if (req.body.body.trim() === "") return res.status(400).json({ comment: "Must not be empty" });

    let newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        scribbleId: req.params.scribbleId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/scribbles/${req.params.scribbleId}`).get()
        .then(doc => {
            if (!doc.exists) {
                return res.status(404).json({ error: "Scribble not found!" })
            }
            return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        })
        .then(() => {
            return db.collection("comments").add(newComment);
        })
        .then(() => {
            res.json(newComment);
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// ======= like a scribble =======
exports.likeScribble = (req, res) => {
    let likeDoc = db.collection("likes")
        .where("userHandle", "==", req.user.handle)
        .where("scribbleId", "==", req.params.scribbleId)
        .limit(1);

    let scribbleDoc = db.doc(`/scribbles/${req.params.scribbleId}`);

    let scribbleData = {};

    scribbleDoc.get()
        .then(doc => {
            if (doc.exists) {
                scribbleData.scribbleId = doc.id;
                return likeDoc.get();
            } else {
                return res.status(404).json({ error: "Scribble not found!" });
            }
        })
        .then(data => {
            if (data.empty) {
                return db.collection("likes")
            }
        })
}