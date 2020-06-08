const mongoose = require("mongoose");

const FeedbackSchema = mongoose.Schema({
    content: String,
    title: String,
    typeID: Number,
    rate: Number,
    anonymous: Boolean,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;