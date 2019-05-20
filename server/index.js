'use strict';

const express = require('express')
const morgan = require('morgan')
const handlers = require('./handlers.js')

const app = express()
const addr = process.env.ADDR || ':80'
const [host, port] = addr.split(':')

app.use(morgan('dev'))

// Set up generic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.set("Content-Type", "text/plain");
    res.status(500).send(err.message);
});

app.post('/api/maps', handlers.createMap)
app.post('/api/paths/start', handlers.setStart)
app.post('/api/paths/goal', handlers.setGoal)
app.post('/api/costs', handlers.setCosts)
app.get('/api/paths', handlers.findPath)

app.listen(port, host, () => {
    console.log(`server is listening at http://${addr}...`);
});