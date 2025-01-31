const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("./config/config-passport");

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use(express.static("public"));

app.use((req, res) => {
  res.status(404).json({ 
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts or /api/users" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;