const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: String,
    icons: String,
    level: String,
    status: Boolean,
    typeID: Number,
 
}, {
    timestamps: true,
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;