const mongoose = require("mongoose");

const DocumentSchema = mongoose.Schema({

    // "name": "String",
    // "shortDesc": "String",
    // "contents": "String",
    // "categoryId": "5ed76e349a42301be44fda3e",
    // "isRecommend": true,
    // "authorID": "5eda8ddca8983223bc9f4483"

    name: String,
    shortDesc: String,
    contents: String,
    image : String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    views: {
        type: Number,
        default: 0,
    },
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

const Document = mongoose.model("Document", DocumentSchema);
module.exports = Document;