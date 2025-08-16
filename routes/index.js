const express = require("express");
const webhookRoutes = require("./webhook");
const healthRoutes = require("./health");

const router = express.Router();

// Mount routes
router.use("/webhook", webhookRoutes);
router.use("/health", healthRoutes);

// Root endpoint
router.get("/hello", (req, res) => {
  res.status(200).send("I am ok. whtools server running!");
});
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Multi-Client Webhook API Server",
  });
});

module.exports = router;
