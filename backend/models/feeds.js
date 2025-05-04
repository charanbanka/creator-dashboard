// {
//     _id: ObjectId,
//     source: "twitter" | "reddit" | "linkedin",
//     externalId: String,           // e.g., Tweet ID or Reddit post ID
//     content: String,
//     mediaUrl: String,
//     author: String,
//     postUrl: String,
//     reportedBy: [ObjectId],       // user IDs who reported the post
//     createdAt: Date
//   }
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
  },
  {
    timestamps: true,
  }
);
