// Express boilerplate, hosting the `dist` file, connecting to the routes

import express from "express";
import compression from "compression";
import 'express-async-errors';
import { logger } from "./server/middleware/logger.js";
import { errorHandler } from "./server/middleware/error_handler.js";
import { todoRouter } from "./server/routes/router.js";
const port = 8080;
const app = express();

app.use([logger, compression(), express.json()]);
app.use(express.static('dist'));
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


// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const api = require('./server/routes/api');

// const main = async () => {

//   const app = express();

//   app.use(express.static(path.join(__dirname, 'dist')));

//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: false }));

//   app.use('/', api);

//   const port = process.env.PORT || '3042';
//   app.listen(port, function () { console.log('Running on ' + port); });
// };

// main();
