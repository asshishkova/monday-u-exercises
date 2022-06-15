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

// app.get('/', (req, res) => {
//   res.send('root');
//   // res.status(200).json({
//   //     health: 'ok'
//   // });
// });

// app.post('/error', async (req, res, next) => {
//     try {
//         let error = Error("My shiny error");
//         error.statusCode = 400;
//         throw error;
//     } catch (e) {
//         next(e);
//     }
// });


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