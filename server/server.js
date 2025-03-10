// Entry point: sets up Express, Socket.io, and loads all routes/middlewares
require("dotenv").config();

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./config/oauth");

// Import the routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const logRoutes = require("./routes/logRoutes");

// Import the database connection
const connectDB = require("./config/db");

// Create the app
const app = express();

// Import the logger middleware
const logMiddleware = require("./middlewares/logMiddleware");

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // Session TTL (1 day)
    }),
    cookie: {
      // Allow override of secure cookie requirement using TEST_PROD env variable
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.TEST_PROD !== "true",
      httpOnly: true, // Helps prevent client side JS from reading the cookie
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiry: 1 day
    },
  }),
);

// Initialize Passport and its session support
app.use(passport.initialize());
app.use(passport.session());

// Parse JSON request bodies
app.use(express.json());

// Use the logger middleware
app.use(logMiddleware);

// Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/logs", logRoutes);

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
app.set("socketio", io);

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
