const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const Calculation = require("../models/Calculation");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
    console.log("✅ /calculate route hit");

    console.log("User ID from token:", req.user.id);

    const body = JSON.stringify(req.body);
    const python = spawn("python", ["calculate_indices.py", body]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
        result += data.toString();
    });

    python.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    python.on("close", async (code) => {
        if (code !== 0 || !result) {
            console.error("❌ Python script error:", errorOutput);
            return res
                .status(500)
                .json({ error: "Python script failed", details: errorOutput });
        }

        try {
            const parsed = JSON.parse(result);

            // Handle if script itself returned an error in JSON
            if (parsed.error) {
                console.error("❌ Script returned error:", parsed.error);
                return res
                    .status(500)
                    .json({ error: "Script error", details: parsed.error });
            }

            const newCalculation = new Calculation({
                userId: req.user.id,
                geometry: req.body.geometry,
                years: req.body.years,
                startYear: Math.min(...req.body.years),
                endYear: Math.max(...req.body.years),
                results: parsed.map(yearData => ({
                    year: yearData.year,
                    indices: {
                        NDVI: yearData.NDVI,
                        NDMI: yearData.NDMI,
                        NDSI: yearData.NDSI,
                        GCI: yearData.GCI,
                        EVI: yearData.EVI,
                        AWEI: yearData.AWEI,
                        LST: yearData.LST
                    }
                }))
            });

            await newCalculation
                .save()
                .then(() => {
                    console.log("✅ Calculation saved to DB");
                    res.json(parsed);
                })
                .catch((err) => {
                    console.error("❌ DB Save error:", err);
                    res.status(500).json({ error: "Failed to save to DB", details: err });
                });
        } catch (err) {
            console.error("❌ JSON parse error:", result);
            res
                .status(500)
                .json({ error: "Failed to parse Python output", raw: result });
        }
    });
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const calculations = await Calculation.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(calculations);
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

module.exports = router;