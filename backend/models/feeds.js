const mongoose = require("mongoose");
const feedSchema = mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["twitter", "reddit", "linkedin"],
      required: true,
    },
    externalId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    reportedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: false,
    },
    postCreatedAt: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feeds", feedSchema);
