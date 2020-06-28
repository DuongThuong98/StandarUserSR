const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
    name: String,
    status: Number,
    content: Number,
    linkVideo: [String],
    category: {
        type: String,
        default: "chính thức",//chính thức hoặc bổ túc
    },
    dateOpening: {
        type: Date,
        default: new Date(),
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
}, {
    timestamps: true,
});

const Class = mongoose.model("Class", ClassSchema);
module.exports = Class;