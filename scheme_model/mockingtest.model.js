const mongoose = require("mongoose");

const MockingTestSchema = mongoose.Schema({
    name: String,
    questionLink: String,
    audioLinks:  { type: Array, default: [] },
    answerKeyLink: String,
    answerKeys: { type: Array, default: [] },
    authorID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    mocktestType :String,//"listening"//"reading",
    
}, {
    timestamps: true,
});

const MockingTest = mongoose.model("MockingTest", MockingTestSchema);
module.exports = MockingTest;