const mongoose = require("mongoose");

const SubmitSchema = mongoose.Schema({
    grade: String,
    respond: String,
    assignmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    },
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

const Submit = mongoose.model("Submit", SubmitSchema);
module.exports = Submit;