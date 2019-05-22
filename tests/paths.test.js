const app = require('../app')
const async = require('async')
const request = require('supertest')
const route = '/api/paths'
const costsTwisty = {
	"costs": [
		{
			"i": 0,
			"j": 1,
			"value": 100
		},
		{
			"i": 1,
			"j": 1,
			"value": 100
		},
		{
			"i": 2,
			"j": 1,
			"value": 100
		},
		{
			"i": 3,
			"j": 1,
			"value": 100
		},
		
		{
			"i": 4,
			"j": 3,
			"value": 100
		},
		{
			"i": 3,
			"j": 3,
			"value": 100
		},
		{
			"i": 2,
			"j": 3,
			"value": 100
		},
		{
			"i": 1,
			"j": 3,
			"value": 100
		}
	]
}

const costsImpossible = {
	"costs": [
		{
			"i": 0,
			"j": 1,
			"value": "Infinity"
		},
		{
			"i": 1,
			"j": 0,
			"value": "Infinity"
		}
	]
}
describe('Test /api/paths', () => {
    // Make sure map is created first
    beforeAll((done) => {
        async.series([
            (cb) => request(app).post('/api/maps').send({ row: 5, col: 5 }).expect(201, cb),
            (cb) => request(app).post('/api/paths/start').send({ i: 0, j: 0 }).expect(201, cb),
            (cb) => request(app).post('/api/paths/goal').send({ i: 4, j: 4 }).expect(201, cb),
        ], done)
    })

    it('should not respond to a method other than GET', () => {
        return request(app)
            .post(route)
            .expect(404)
    })

    it('should find the shortest path without obstacles', () => {
        return request(app)
            .get(route)
            .expect(200)
            .expect(res => res.body.steps === 9)
    })

    it('should find the shortest path with obstacles', (done) => {
        async.series([
            (cb) => request(app).post('/api/costs').send(costsTwisty).expect(201, cb),
            (cb) => request(app).get(route).expect(res => res.body.steps === 17).expect(200, cb)
        ], done)
    })

    it('should return no path if the goal is blocked', (done) => {
        async.series([
            (cb) => request(app).post('/api/costs').send(costsImpossible).expect(201, cb),
            (cb) => request(app).get(route).expect({steps: 0, path: []}).expect(200, cb)
        ], done)
    })
})