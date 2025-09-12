const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Routes & Middleware
const authRoutes = require("../backend/routes/authRoutes");
const sessionRoutes = require("../backend/routes/sessionRoutes");
const questionRoutes = require("../backend/routes/questionRoutes");
const { protect } = require("../backend/middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("../backend/controllers/aiController");

// Create Express app
const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// ✅ MongoDB connection (only connect if not connected already)
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Serve uploads (⚠️ works only if files are in repo, not dynamic uploads in Vercel)
app.use("/uploads", express.static(path.join(__dirname, "../backend/uploads")));

// ✅ Export app (no app.listen)
module.exports = app;
