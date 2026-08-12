const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const healthRouter = require("./routes/health");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");

const {
  metricsMiddleware,
  metricsHandler
} = require("./metrics/prometheus");

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(requestLogger);
app.use(metricsMiddleware);

app.use("/health", healthRouter);
app.get("/metrics", metricsHandler);

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found"
    }
  });
});

app.use(errorHandler);

module.exports = app;
