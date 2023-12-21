const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const { notFoundHandler, globalErrorHandler } = require("./middlewares");
const { waterRouter, usersRouter } = require("./routes");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/water", waterRouter);
app.use("/users", usersRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
