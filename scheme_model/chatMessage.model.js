const mongoose = require("mongoose");

const ChatMessageSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
