const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const tweetsRouter = require("./routes/api/tweets");
const dotenv = require("dotenv");
const authRouter = require("./routes/api/auth");

dotenv.config();
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/tweets", tweetsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
