// Global loggin middleware
const Log = require("../models/logModel");

const logMiddleware = async (req, res, next) => {
  // Skip logging only for GET requests to /api/logs endpoints.
  if (req.method === "GET" && req.originalUrl.startsWith("/api/logs")) {
    return next();
  }

  // Create a new log entry with request details.
  const logEntry = new Log({
    method: req.method,
    route: req.originalUrl,
    user: req.user ? req.user._id : null,
    role:
      req.user && req.user.role ? req.user.role.name || req.user.role : null,
    ip: req.ip,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });

  // Wrap res.send to capture response status and details.
  const originalSend = res.send;
  res.send = function (data) {
    logEntry.responseStatus = res.statusCode;
    logEntry.details = { responseData: data };
    logEntry
      .save()
      .catch((err) => console.error("Error saving log entry:", err));
    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = logMiddleware;
