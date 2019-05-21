'use strict';

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.json())

app.post('/api/maps', createMap)
app.post('/api/paths/start', setStart)
app.post('/api/paths/goal', setGoal)
app.post('/api/costs', setCosts)
app.get('/api/paths', findPath)


/* Map representation: 
    width:  int    - The width of the map
    height: int    - The height of the map
    start:  {i, j} - Starting coordinates
    goal:   {i, j} - Goal coordinates
    costs:  [][]   - 2D array; each cell stores int representing tile cost 
*/
let map = {}

//////////////
/* Handlers */
//////////////
function createMap(req, res, next) {
    // Send error message if either param is missing or invalid
    if (!parseInt(req.body.row) || !parseInt(req.body.col)) {
        return sendMessage(res, 400, 'Invalid map dimensions provided.')
    }

    // Create new map
    map = {
        width: req.body.col,
        height: req.body.row
    }

    map.costs = createCostArray(map.width, map.height)

    res.status(201).send({
        row: map.height,
        col: map.width
    })
}

function setStart(req, res, next) {
    if (!mapExists()) {
        return sendMessage(res, 400, 'Map has not yet been created.')
    }
    
    if (!validCoords(req.body)) {
        return sendMessage(res, 400, 'Invalid starting coordinates.')
    }

    map.start = {
        i: req.body.i,
        j: req.body.j
    }

    res.status(201).send(map.start)
}

function setGoal(req, res, next) {
    if (!mapExists()) {
        return sendMessage(res, 400, 'Map has not yet been created.')
    }
    
    if (!validCoords(req.body)) {
        return sendMessage(res, 400, 'Invalid goal coordinates.')
    }

    map.goal = {
        i: req.body.i,
        j: req.body.j
    }

    res.status(201).send(map.goal)
}

function setCosts(req, res, next) {
    if (!mapExists()) {
        return sendMessage(res, 400, 'Map has not yet been created.')
    }

    if (!req.body.costs || req.body.costs.length === 0) {
        return sendMessage(res, 400, 'No costs provided.')
    }

    let newCosts = JSON.parse(JSON.stringify(map.costs));
    for (let i = 0; i < req.body.costs.length; i++) {
        let cost = req.body.costs[i]
        if (validCoords(cost) && !isNaN(parseFloat(cost.value))) {
            newCosts[cost.j][cost.i] = parseFloat(cost.value)
        } else {
            return sendMessage(res, 400, `Invalid cost at position ${i}.`)
        }
    }

    map.costs = newCosts
    res.status(201).send({costs: req.body.costs})
}

function findPath(req, res, next) {
    if (!mapExists()) {
        return sendMessage(res, 400, 'Map has not yet been created.')
    }

    if (!map.start) {
        return sendMessage(res, 400, 'Start position not yet set.')
    }

    if (!map.goal) {
        return sendMessage(res, 400, 'Goal position not yet set.')
    }
    
    // Use A* algorithm for pathfinding
    res.status(501).send('Not yet implemented')
}

/////////////
/* Helpers */
/////////////

// Send a status code and plaintext message
function sendMessage(res, status, message) {
    res.set("Content-Type", "text/plain");
    res.status(status).send(message);
}

function validCoords(obj) {
    let i = parseInt(obj.i)
    let j = parseInt(obj.j)
    return i >= 0 && i < map.width && j >= 0 && j < map.height
}

function mapExists() {
    return Object.entries(map).length !== 0
}

function createCostArray(width, height) {
    let arr = []
    for (let i = 0; i < height; i++) {
        arr[i] = Array(width).fill(0)
    }
    return arr
}


module.exports = app