const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    url: { type: String, required: true },
    userid: { type: String, required: true },
    likes: [
        {
            userid: { type: String }
        }
    ],
    comments: [
        {
            userid: { type: String },
            name: { type: String },
            comment: { type: String }
        }
    ]
});

module.exports = mongoose.model('Image', imageSchema);