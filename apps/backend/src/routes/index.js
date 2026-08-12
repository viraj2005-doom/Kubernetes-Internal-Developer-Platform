const express = require("express");

const itemsRouter = require("./items");
const healthRouter = require("./health");

const router = express.Router();

router.use("/items", itemsRouter);
router.use("/health", healthRouter);

module.exports = router;