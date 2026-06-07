require("dotenv").config();
const express = require("express");
const path    = require("path");
const handler = require("./api/generate");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Wire the Vercel handler to Express for local testing
app.post("/api/generate", (req, res) => handler(req, res));

app.listen(3000, () => {
  console.log("\n🚀 Local dev server running at http://localhost:3000");
  console.log("   (Same code that runs on Vercel)\n");
});