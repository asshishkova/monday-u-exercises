const express = require('express');
const compression = require('compression');
require('express-async-errors');
const requestLoggerMiddleware = require("./server/middleware/request-logger.js");
const errorHandler = require("./server/middleware/error-handler.js");
const todoRouter = require("./server/routes/router.js");
const port = 3001;
const app = express();
app.use([express.json(), requestLoggerMiddleware, compression()]);
// app.use(express.static('dist'));
app.use('/todo', todoRouter);
app.use(errorHandler);


process.on('unhandledRejection', (reason, promise) => {
    console.log("Unhandled Rejection", reason.message);
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception", error.message);
    process.exit(1);
});

app.listen(port, () => {
    console.log("Server started on port", port);
});
