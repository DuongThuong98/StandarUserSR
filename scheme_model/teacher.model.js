const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
    salary: Number,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    shifts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
    }, ]
}, {
    timestamps: true,
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;