'use strict';
const app = require('./app')

const addr = process.env.ADDR || ':80'
const [host, port] = addr.split(':')

app.listen(port, host, () => {
    console.log(`server is listening at http://${addr}...`);
});