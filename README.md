# path-planner
An API that supports building a map and finding the optimal path through it.

## Instructions
1. Navigate to [repo](https://github.com/jchou8/path-planner)
2. Clone locally using `git clone https://github.com/jchou8/path-planner.git`

### Backend
3. Navigate to /server
4. Install dependencies with `npm install`
5. Start server locally using `npm run start`

### Frontend
6. Open /client/index.html in your web browser
7. That's it!

## Notes
* I built the server using Node.js and [Express](https://expressjs.com/).
* Other libraries used include:
  * [morgan](https://github.com/expressjs/morgan), middleware for logging Express requests
  * [tinyqueue](https://github.com/mourner/tinyqueue), a priority queue I used for my A* implementation
  * [Jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest) for route testing

## Bonuses
### Handle errors gracefully
I added some simple error handling to each route - in response to invalid user input, no modification to the server state is made, and the server responds with a `400` status code and a plaintext message describing the problem.
* `POST /api/maps` fails if either the given `row` or `col` is missing, not a number, or less than 1.
* `POST /api/paths/start` and `POST /api/paths/goal` fail if the map has not yet been made or the given coordinates are invalid/out of bounds.
* `POST /api/costs` fails if the map has not yet been made, no costs are provided, or any of the costs has invalid coordinates/values.
* `GET /api/paths` fails if the map has not yet been made, or the start and goal positions have not both been set.

### Write unit tests for your algorithms
Using [Jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest), I wrote several tests for each route to ensure that they provide the correct status codes and responses in response to valid and invalid input. These tests can be run with `npm test`.

### Visualize the path with a frontend application
(in progress)