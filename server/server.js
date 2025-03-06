// Entry point: sets up Express, Socket.io, and loads all routes/middlewares
require("dotenv").config();

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const passport = require("./config/oauth");

// TEMPORARY FOR PROTECTED ROUTE TESTING
const isAuthenticated = require("./middlewares/authMiddelware");

// Import the routes
const authRoutes = require("./routes/authRoutes");

// Import the database connection
const connectDB = require("./config/db");

// Create the app
const app = express();

// Set up session middleware
app.use(session({ secret: process.env.SESSION_SECRET }));

// Initialize Passport and its session support
app.use(passport.initialize());
app.use(passport.session());

// Parse JSON request bodies
app.use(express.json());

// Log each request's path and method
app.use((req, _res, next) => {
  console.log(req.path, req.method);
  next();
});

// Mount the routes
app.use("/api/auth", authRoutes);

//TEMPORARY ROUTES FOR TESTING LOGIN
app.get("/", (_req, res) => {
  res.send('<a href="/api/auth/login">Login with Google</a>');
});

// TEMPORARY ROUTE FOR TESTING PROTECTED ROUTE
app.get("/protected", isAuthenticated, (req, res) => {
  res.send(`
    <h1>Current User Data</h1>
    <pre>${JSON.stringify(req.user, null, 2)}</pre>
    <a href="/api/auth/logout">Logout</a>
  `);
});

// Serve the static files from Vite
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Define the port and create the HTTP server
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Attach Socket.io for real-time updates
const io = socketIo(server);
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log("Connected to database, server listening on port:", port);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
