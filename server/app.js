'use strict';

const express = require('express')
const morgan = require('morgan')
const TinyQueue = require('tinyqueue')

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
    if (!parseInt(req.body.row) || !parseInt(req.body.col) ||
        req.body.row <= 0 || req.body.col <= 0) {
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
    res.status(201).send({ costs: req.body.costs })
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

    let path = search(map)
    res.status(200).send({
        steps: path.length,
        path: path
    })
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

// Heuristic function to calculate disance from goal
function heuristic(a, b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
}

// Get neighboring nodes
function neighbors(node, iMax, jMax) {
    let result = []
    if (node.i > 0) {
        result.push({ i: node.i - 1, j: node.j })
    }

    if (node.j > 0) {
        result.push({ i: node.i, j: node.j - 1 })
    }

    if (node.i < iMax - 1) {
        result.push({ i: node.i + 1, j: node.j })
    }

    if (node.j < jMax - 1) {
        result.push({ i: node.i, j: node.j + 1 })
    }

    return result
}

function coordsEqual(a, b) {
    return a.i === b.i && a.j === b.j
}

// Returns the path between start and goal points of the given map
function search(map) {
    // A* pathfinding algorithm
    let startNode = {
        i: map.start.i,
        j: map.start.j,
        value: 0,
        cost: 0
    }
    let queue = new TinyQueue([startNode], (a, b) => a.value - b.value)
    let visited = [startNode]
    let foundPath = false
    let current

    while (queue.length > 0) {
        current = queue.pop()
        if (coordsEqual(current, map.goal)) {
            foundPath = true
            break
        }

        let curCost = visited.find(node => coordsEqual(node, current)).cost
        neighbors(current, map.height, map.width).forEach(neighbor => {
            let newCost = curCost + map.costs[neighbor.j][neighbor.i] + 1
            let visitedNode = visited.find(node => coordsEqual(node, neighbor))
            if ((!visitedNode || newCost < visitedNode.cost) && newCost < Infinity) {
                if (!visitedNode) {
                    visitedNode = {
                        i: neighbor.i,
                        j: neighbor.j,
                        cost: newCost
                    }
                    visited.push(visitedNode)
                } else {
                    visitedNode.cost = newCost
                }

                visitedNode.value = newCost + heuristic(neighbor, map.goal)
                visitedNode.parent = current
                queue.push(visitedNode)
            }
        })
    }

    let path = []

    if (foundPath) {
        // Backtrack through parent pointers to get path
        while (current) {
            path.push({ i: current.i, j: current.j })
            current = current.parent
        }
    }

    return path
}

module.exports = app