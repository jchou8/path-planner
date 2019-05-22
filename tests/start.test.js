const app = require('../app')
const request = require('supertest')
const route = '/api/paths/start'

describe('Test /api/paths/start', () => {
    // Make sure map is created first
    beforeAll(() => {
        return request(app)
            .post('/api/maps')
            .send({ row: 5, col: 5 })
    })

    it('should not respond to a method other than POST', () => {
        return request(app)
            .get(route)
            .expect(404)
    })

    it('should successfully create a start location', () => {
        return request(app)
            .post(route)
            .send({i: 4, j: 3})
            .expect(201, {i: 4, j: 3})
    })

    it('should fail if a coordinate is missing', () => {
        return request(app)
            .post(route)
            .send({i: 4})
            .expect(400)
    })

    it('should fail if a coordinate is not an integer', () => {
        return request(app)
            .post(route)
            .send({i: 4, j: 'e'})
            .expect(400)
    })

    it('should fail if a coordinate is out of bounds', () => {
        return request(app)
            .post(route)
            .send({i: 10, j: 3})
            .expect(400)
    })
})