const mongoose = require("mongoose");

const ChatSectionSchema = mongoose.Schema(
  {
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    }],
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatSection", ChatSectionSchema);
