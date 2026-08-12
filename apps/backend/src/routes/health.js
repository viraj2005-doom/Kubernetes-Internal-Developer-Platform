const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0",
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0",
      database: "disconnected"
    });
  }
});

module.exports = router;