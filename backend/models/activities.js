const mongoose = require("mongoose");
const activitySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feed",
      required: false,
    },
    action: {
      type: String,
      enum: ["save", "share", "report", "profile_completion", "daily_login", "unsave"],
      required: true,
    },
    metadata: {
      sharedTo: {
        type: String,
        default: "",
      },
      reportReason: {
        type: String,
        default: "",
      },
      postTitle: {
        type: String,
        default: "",
      },
      postSource: {
        type: String,
        default: "",
      },
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activities", activitySchema);
