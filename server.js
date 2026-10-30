const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(__dirname, ".env")
});

const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middleware
app.use(express.json());

// Serve Frontend Files
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
connectDB();

// API Routes
app.use("/todos", todoRoutes);

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
