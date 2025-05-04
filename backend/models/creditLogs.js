// {
//     _id: ObjectId,
//     userId: ObjectId,
//     type: "daily_login" | "profile_complete" | "interaction" | "admin_adjustment",
//     amount: Number,
//     createdAt: Date
//   }

const mongoose = require("mongoose");
const creditLogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "daily_login",
        "profile_complete",
        "interaction",
        "admin_adjustment",
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
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
); // Add a method to get the date in a readable format

module.exports = mongoose.model("CreditLogs", creditLogSchema);
