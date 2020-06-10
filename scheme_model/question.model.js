const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const QuestionSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    passwordHash: String,
    avatar: String,
    displayName: String,
    phone: String,
    birthdate: Date,
    googleID: String,
    facebookID: String,
   
    gender: String,
    isBlock: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
  
  },
  {
    timestamps: true
  }
);



module.exports = mongoose.model('Question', QuestionSchema);
