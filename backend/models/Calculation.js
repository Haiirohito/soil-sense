const mongoose = require("mongoose");

const calculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  geometry: { type: Array, required: true },
  years: { type: [Number], required: true },
  startYear: Number,
  endYear: Number,
  results: [
    {
      year: Number,
      indices: {
        NDVI: Number,
        NDMI: Number,
        NDSI: Number,
        GCI: Number,
        EVI: Number,
        AWEI: Number,
        LST: Number
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Calculation", calculationSchema);
