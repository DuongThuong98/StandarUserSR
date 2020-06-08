const mongoose = require("mongoose");

const TestListSchema = mongoose.Schema({
    name: String,
    contents: String,
    audioLink: String,
}, {
    timestamps: true,
});

const TestList = mongoose.model("TestList", TestListSchema);
module.exports = TestList;