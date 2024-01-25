const express = require("express");

const app = express();

app.use(express.json());

// TODO: Add code to meet the requirements and make the tests pass.
const urlsRouter = require("./urls/urls.router");
const usesRouter = require("./uses/uses.router");

app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

// Not found handler
app.use((request, response, next) => {
    next({
        status: 404,
        message: `Not found: ${request.originalUrl}`
    });
});
  
// Error handler
app.use((error, request, response, next) => {
    console.error(error);
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).json({ error: message });
});

module.exports = app;
