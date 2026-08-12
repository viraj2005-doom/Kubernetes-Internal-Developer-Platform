const client = require("prom-client");

// A registry stores all metrics that this backend exposes to Prometheus.
const register = new client.Registry();

// Collect useful Node.js process metrics like memory usage, CPU time, and event loop delay.
client.collectDefaultMetrics({
  register
});

// Counts how many HTTP requests the backend receives.
// Labels help us group the count by method, route, and response status.
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register]
});

// Measures how long HTTP requests take to finish.
// Buckets define the time ranges Prometheus uses to group request durations.
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register]
});

function metricsMiddleware(req, res, next) {
  // Save the start time before the request is handled.
  const start = process.hrtime.bigint();

  // The "finish" event runs after Express sends the response.
  res.on("finish", () => {
    // Convert the request time from nanoseconds to seconds.
    const durationSeconds =
      Number(process.hrtime.bigint() - start) / 1e9;

    // Use the matched Express route when available, otherwise use the request path.
    const route = req.route?.path || req.path;

    // Increase the request counter by 1 for this method, route, and status code.
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });

    // Record how many seconds this request took.
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode
      },
      durationSeconds
    );
  });

  next();
}

async function metricsHandler(req, res, next) {
  try {
    // Prometheus expects metrics in a specific text format and content type.
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    // Pass any error to Express error handling middleware.
    next(error);
  }
}

module.exports = {
  metricsMiddleware,
  metricsHandler,
  register
};
