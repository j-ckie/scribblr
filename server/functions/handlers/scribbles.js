const { db } = require("../util/admin");

// view all scribbles
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

// post one scribble
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


