const { db } = require("../util/admin");

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

