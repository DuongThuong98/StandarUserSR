const mongoose = require("mongoose");

const MockingTestSchema = mongoose.Schema({
    name: String,
    questionKeyLink: String,
    audioLink:  { type: Array, default: [] },
    answerKeyLink: String,
    
}, {
    timestamps: true,
});

const MockingTest = mongoose.model("MockingTest", MockingTestSchema);
module.exports = MockingTest;