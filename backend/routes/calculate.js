// routes/calculate.js
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const Calculation = require("../models/Calculation");
const authMiddleware = require("../middleware/authMiddleware");

// ===================== CALCULATION ROUTE =====================
router.post("/", authMiddleware, async (req, res) => {
    console.log("✅ /calculate route hit");
    console.log("User ID from token:", req.user.id);

    try {
        const body = JSON.stringify(req.body);
        const python = spawn("python", ["calculate_indices.py", body]);

        let pythonData = "";
        let pythonError = "";

        python.stdout.on("data", (data) => {
            pythonData += data.toString();
        });

        python.stderr.on("data", (data) => {
            pythonError += data.toString();
        });

        python.on("close", async (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}: ${pythonError}`);
                return res.status(500).json({ error: "Calculation failed", details: pythonError });
            }

            try {
                const result = JSON.parse(pythonData);

                // Save calculation in MongoDB
                const newCalculation = new Calculation({
                    userId: req.user.id,
                    geometry: req.body.geometry,
                    results: result,
                });

                await newCalculation.save();

                const years = Object.keys(result).sort();
                res.json({
                    geometry: req.body.geometry,
                    results: result,
                    years,
                    createdAt: newCalculation.createdAt
                });
            } catch (parseErr) {
                console.error("❌ JSON parse error:", pythonData);
                res.status(500).json({ error: "Invalid JSON output from Python", details: pythonData });
            }
        });
    } catch (err) {
        console.error("❌ Server error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ===================== HISTORY ROUTE =====================
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const history = await Calculation.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        const formattedHistory = history.map(entry => ({
            _id: entry._id,
            createdAt: entry.createdAt,
            geometry: entry.geometry,
            results: entry.results || {}, // Ensure results exist
        }));

        res.json(formattedHistory);
    } catch (err) {
        console.error("❌ Error fetching history:", err);
        res.status(500).json({ error: "Failed to fetch calculation history" });
    }
});

module.exports = router;
