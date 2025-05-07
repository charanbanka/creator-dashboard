const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config(); // Ensure dotenv is used for environment variables

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(helmet());

// Environment variables
const PORT = 8080;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("Error: DB_URL is not defined in environment variables.");
  process.exit(1); // Exit the process if DB_URL is missing
}

app.use("/", express.static("public")); // Serve static files from 'public' directory
app.use("/api", require("./routes/index")); // Use the routes defined in the routes directory

// Default route for testing
app.get("/health", (req, res) => {
  res.send({ status: "ok", message: "Server is healthy" });
});

// Database connection
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");

    // ✅ Start server here
    app.listen(PORT, () => {
      console.log(`✅ Server running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit the process if DB connection fails
  });
