require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      message: "my-api started",
      port: PORT,
      environment: process.env.NODE_ENV || "development",
      version: process.env.APP_VERSION || "1.0.0"
    })
  );
});

function shutdown(signal) {
  console.log(
    JSON.stringify({
      message: `Received ${signal}. Shutting down gracefully.`
    })
  );

  server.close(() => {
    console.log(
      JSON.stringify({
        message: "HTTP server closed"
      })
    );

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));