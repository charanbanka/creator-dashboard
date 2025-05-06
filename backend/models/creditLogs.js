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
    action: {
      type: String,
      required: false,
    },
    credits: {
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
