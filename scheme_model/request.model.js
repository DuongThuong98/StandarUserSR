const mongoose = require("mongoose");
const enumStatus = require("../enums/ECourseRequestsStatus ");


const RegisterCourseRequestSchema = mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        default: enumStatus.PENDING
    }
   

}, {
    timestamps: true,
});

const Request = mongoose.model("CourseRequest", RegisterCourseRequestSchema);
module.exports = Request;