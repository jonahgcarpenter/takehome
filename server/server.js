require("dotenv").config();
require("./utils/oauth");

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const passport = require("passport");

// TEMPORARY FOR PROTECTED ROUTE TESTING
const { isAuthenticated } = require("./utils/oauth");

// Import the routes
const authRoutes = require("./routes/authRoutes");

// Import the database connection
const connectDB = require("./config/db");

// Create the app
const app = express();

// Use session and passport middleware
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());

// Console log requested path and method
app.use((req, _res, next) => {
  console.log(req.path, req.method);
  next();
});

// Use imported routes
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

// Default port
const port = process.env.PORT || 3000;

// Ensure the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  console.error(
    "Error: MONGODB_URI is not defined in your environment variables.",
  );
  process.exit(1);
}

// Create the http server
const server = http.createServer(app);

// Attach socket.io to the server
const io = socketIo(server);

// Websocket connection event handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Disconnect event handling
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect database and start server
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log("Connected to database, server listening on port:", port);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
