const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const AdminSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{
  timestamps: true
});

AdminSchema.methods.setPassword = function (password) {
  this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

AdminSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model("Admin", AdminSchema);