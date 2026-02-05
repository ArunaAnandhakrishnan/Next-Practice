const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./auth");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json()); 
/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);

/* =======================
   HEALTH CHECK (OPTIONAL)
======================= */
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

/* =======================
   ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
