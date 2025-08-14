const mongoose = require("mongoose");

const CalculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  geometry: { type: Object, required: true },
  results: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Calculation", CalculationSchema);
