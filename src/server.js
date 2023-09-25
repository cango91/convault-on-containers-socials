require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const sanitize = require('express-mongo-sanitize');
const connectDB = require('./utilities/db');
const authenticateService = require('./middleware/authenticate-service');

const TEST = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test'
const DEBUG = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() !== 'production' : true;
const PORT = 3001;

const configureApp = (middleware) => {

    const app = express();
    app.use(logger('dev'));
    app.use(express.json());
    app.use(sanitize());

    if (middleware) app.use(middleware);

    return app;
}

const app = configureApp();

app.use(authenticateService);

if (!TEST) {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Authentication microservice running on port ${PORT}`);
    });
}

module.exports = { app, configureApp }