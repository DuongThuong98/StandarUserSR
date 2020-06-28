const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
    name: String,
    status: Number,
    linkVideo: String,
    linkDoc : String,
    linkHomework: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mocktest",
    },
    isDoneHomework: {
        type : Boolean,
        default: false
    }

}, {
    timestamps: true,
});

const Curriculum = mongoose.model("Curriculum", CurriculumSchema);
module.exports = Curriculum;