const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/reportsystem")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Report Schema
const reportSchema = new mongoose.Schema({
  heading: String,
  description: String,
  concern: String,
  building: String,
  status: { type: String, default: "Pending" },
  image: String, // save image path
  createdAt: { type: Date, default: Date.now },
});
const Report = mongoose.model("Report", reportSchema);

// Submit a report with image
app.post("/api/reports", upload.single("imageFile"), async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming file:", req.file);

    const { heading, description, concern, building } = req.body;

    const newReport = new Report({
      heading,
      description,
      concern,
      building,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newReport.save();
    res.json({ success: true, report: newReport });
  } catch (err) {
    console.error("Report submission error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get reports
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("Fetch reports error:", err);
    res.status(500).json({ success: false, message: "Error fetching reports" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
