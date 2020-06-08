const mongoose = require("mongoose");

const AssignmentSchema = mongoose.Schema({
    name: String,
    content: String,
    respond: String,
    deadline: {
        type: Date,
        default: new Date(),
    },
    status: Boolean,
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    dateOpening: {
        type: Date,
        default: new Date(),
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true,
});

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;