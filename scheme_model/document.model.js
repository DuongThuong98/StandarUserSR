const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
    name: String,
    shortDesc: String,
    contents: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    views: Number,
    comments: [{
        content: String,
    }, ],
    isRecommend: Boolean,
    upload: {
        type: Date,
        default: Date,
    },
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;