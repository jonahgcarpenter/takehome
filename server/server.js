require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Create the app
const app = express();

// Middleware
app.use(express.json());

// Console log requested path and method
app.use((req, _res, next) => {
  console.log(req.path, req.method);
  next();
});

// Serve the static files from Vite
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Default port
const port = process.env.PORT || 3000;

// Ensure the MongoDB URI is defined
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error(
    "Error: MONGODB_URI is not defined in your environment variables.",
  );
  process.exit(1);
}

// Connect database and start server
mongoose
  .connect(mongoURI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to database, server listening on port:", port);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
