const Image = require('../models/Image');

module.exports.add_new_image = (req, res) => {
    const image = new Image({
        url: req.body.url,
        userid: req.body.userid,
        likes: [],
        comments: []
    });

    image.save()
    .then((result) => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

module.exports.like_image = (req, res, next) => {
    const imageid = req.params.imageid;
    const userid = req.body.userid;
    const insertLike = { userid: userid };

    Image.find({
        likes: { $elemMatch: insertLike }, 
    })
    .where('_id', imageid)
    .exec()
    .then((doc) => {
        if(doc.length > 0) {
            res.status(403).json({
                message: 'User have already liked image'
            });
        } else {
            Image.update(
                { _id: imageid },
                { $push: { likes: insertLike } }
            )
            .exec()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    message: 'Like created'
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
};

module.exports.unlike_image = (req, res, next) => {
    const imageid = req.params.imageid;
    const userid = req.body.userid;
    const deleteLike = { userid: userid };

    Image.find({
        likes: { $elemMatch: deleteLike }, 
    })
    .where('_id', imageid)
    .exec()
    .then((doc) => {
        if(doc.length === 0) {
            res.status(403).json({
                message: 'User have already unliked image'
            });
        } else {
            Image.update(
                { _id: imageid },
                { $pull: { likes: deleteLike } }
            )
            .exec()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    message: 'Like deleted'
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });
};

module.exports.comment_image = (req, res, next) => {
    const imageid = req.params.imageid;
    const userid = req.body.userid;
    const name = req.body.name;
    const comment = req.body.comment
    const insertComment = {
        userid: userid,
        name: name,
        comment: comment
    };

    Image.update(
        { _id: imageid },
        { $push: { comments: insertComment } }
    )
    .exec()
    .then((result) => {
        console.log(result);
        res.status(200).json({
            message: 'Comment created'
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

module.exports.all_images = (req, res, next) => {
    Image.find()
    .exec()
    .then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.get_image_on_imageid = (req, res, next) => {
    const id = req.params.id;
    Image.findById(id)
    .exec()
    .then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.get_images_on_userid = (req, res, next) => {
    const userid = req.params.userid;
    Image.find({
        userid: userid
    })
    .exec()
    .then((docs) => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
};