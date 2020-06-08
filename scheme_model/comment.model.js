const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    title: String,
    content: String,
    datePosted: Number,
    like: Number,
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;