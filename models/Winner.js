const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userImage: { type: String, required: true },
    winningAmount: { type: String, required: true },
    gameName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Winner", winnerSchema);
