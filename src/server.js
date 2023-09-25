require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const sanitize = require('express-mongo-sanitize');
const connectDB = require('./utilities/db');
const authenticateService = require('./middleware/authenticate-service');
const usersRouter = require('./routes/users-router');
const {initializeRabbitMQ} = require('./utilities/rabbit-mq');
const listen = require('./utilities/message-listeners');

const TEST = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test'
const DEBUG = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() !== 'production' : true;
const PORT = 3002;

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

(async ()=>{
    await initializeRabbitMQ();
    await listen();
})();

app.use('/services/socials/api/user', usersRouter);

if (!TEST) {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Socials microservice running on port ${PORT}`);
    });
}

module.exports = { app, configureApp }