const express = require("express");
const app = express();
const methodOverride = require("method-override");
const articleRoutes = require('./routes/articles');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const scheduleRSSFetching = require('./scheduler/scheduleRSSFetching');

// dotenv set
dotenv.config({ path: "./.env" });

// Setup mongodb
mongoose.connect(process.env.DATABASE_LOCAL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override
app.use(methodOverride("_method"));

// Route setup
app.use('/api/articles', articleRoutes);

// 404 Error Handler
app.use((req, res, next) => {
  return res.status(404).json({ error: "Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  // Check if the error status is 404
  if (err.status === 404) {
    return res.status(404).json({ error: "Not Found" });
  } else {
    // For other errors, you can customize the error response
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Scheduler
const FEED_URLS = [
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://feeds.bbci.co.uk/news/rss.xml',
];
scheduleRSSFetching(FEED_URLS);

// server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Running at - http://localhost:${PORT}`);
});
