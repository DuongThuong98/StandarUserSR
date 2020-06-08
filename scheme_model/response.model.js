const mongoose = require("mongoose");

const ResponseSchema = mongoose.Schema({
    content: String,
    title: String,
    feedbackID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;