const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./api');

const errorHandler = require('./helpers/errorHandler');

const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.get('/', (req, res) => {
    res.json({
        message: 'Express API Powered by AWS Lambda!'
    });
})

server.use('/v1/api', apiRouter);
server.use(errorHandler.notFound);
server.use(errorHandler.internalServerError);

module.exports = server
