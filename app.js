require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const https = require("http");
const server = https.createServer(app);
const hostname = "127.0.0.1";

const PORT = 4000;
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow cookies & headers
  })
);
app.use(express.json());

const { console } = require("inspector");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  //   res.send("Hello, Express!");
});

app.use("/api/auth", require("./routes/authRoutes"));

server.listen(PORT, () => {
  console.log(`🎯 Server is started on port: http://${hostname}:${PORT}/`);
});
