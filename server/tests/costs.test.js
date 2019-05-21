const app = require('../app')
const request = require('supertest')
const route = '/api/costs'

describe('Test /api/costs', () => {
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

    it('should successfully create costs', () => {
        return request(app)
            .post(route)
            .send({costs: [{i: 1, j: 1, value: 10}, {i: 2, j: 3, value: 20.19}]})
            .expect(201, {costs: [{i: 1, j: 1, value: 10}, {i: 2, j: 3, value: 20.19}]})
    })
    
    it('should fail if no costs array was given', () => {
        return request(app)
            .post(route)
            .expect(400)
    })

    it('should fail if a coordinate is invalid', () => {
        return request(app)
            .post(route)
            .send({costs: [{i: 1, j: 1, value: 10}, {i: 100, j: 1, value: 10}]})
            .expect(400)
    })

    it('should fail if a value is invalid', () => {
        return request(app)
            .post(route)
            .send({costs: [{i: 1, j: 1, value: 10}, {i: 1, j: 2, value: 'e'}]})
            .expect(400)
    })
})