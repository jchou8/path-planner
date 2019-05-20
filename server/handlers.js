'use strict';

/* Map representation: 
    width:  int    - The width of the map
    height: int    - The height of the map
    start:  {i, j} - Starting coordinates
    goal:   {i, j} - Goal coordinates
    costs:  [][]   - 2D array; each cell stores int representing tile cost 
*/
let map = {}

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

    req.body.costs.forEach(cost => {
        if (validCoords(cost) && !isNaN(parseInt(cost.value))) {
            map.costs[cost.j][cost.i] = parseInt(cost.value)
        }
    })

    res.status(201).send(req.body.costs)
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


module.exports = {
    createMap,
    setStart,
    setGoal,
    setCosts,
    findPath
}