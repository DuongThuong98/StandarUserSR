const mongoose = require("mongoose");

const MockingTestSchema = mongoose.Schema({
    name: String,
    contents: String,
    audioLink: String,
}, {
    timestamps: true,
});

const MockingTest = mongoose.model("MockingTest", MockingTestSchema);
module.exports = MockingTest;