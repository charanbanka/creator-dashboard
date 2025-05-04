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
      required: true,
    },
    action: {
      type: String,
      enum: ["save", "share", "report"],
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
