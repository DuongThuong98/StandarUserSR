const mongoose = require("mongoose");

const FeedbackDetailSchema = mongoose.Schema(
  {
    teacherID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    feedbackID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FeedbackDetail", FeedbackDetailSchema);
