const express = require('express');
const compression = require('compression');
require('express-async-errors');
const requestLoggerMiddleware = require("./middleware/request-logger.js");
const errorHandler = require("./middleware/error-handler.js");
const todoRouter = require("./routes/router.js");
const port = process.env.PORT | 3001;
const app = express();
app.use([express.json(), requestLoggerMiddleware, compression()]);
// app.use('/todo', todoRouter);
app.use('/', todoRouter);
app.use(errorHandler);


process.on('unhandledRejection', (reason, promise) => {
  console.log("Unhandled Rejection", reason.message);
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.log("Uncaught Exception", error.message);
  process.exit(1);
});

console.log("Trying to start server on port", port);
app.listen(port, () => {
  console.log("Server started on port", port);
});
