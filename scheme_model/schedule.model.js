const mongoose = require("mongoose");

const ScheduleSchema = mongoose.Schema({
    day: Number,
    timeOpen: {
        type: Date,
        default: new Date(),
    },
    timeOut: {
        type: Date,
        default: new Date(),
    },
    status: Boolean
}, {
    timestamps: true,
});

const Schedule = mongoose.model("Schedule", ScheduleSchema);
module.exports = Schedule;