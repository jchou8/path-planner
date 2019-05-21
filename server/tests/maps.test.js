const app = require('../app')
const request = require('supertest')
const route = '/api/maps'

describe('Test /api/maps', () => {
    it('should not respond to a method other than POST', () => {
        return request(app)
            .get(route)
            .expect(404)
    })

    it('should successfully create a map', () => {
        return request(app)
            .post(route)
            .send({row: 5, col: 5})
            .expect(201, {row: 5, col: 5})
    })

    it('should fail if no coords given', () => {
        return request(app)
            .post(route)
            .expect(400)
    })

    it('should fail if no row given', () => {
        return request(app)
            .post(route)
            .send({col: 5})
            .expect(400)
    })

    it('should fail if no col given', () => {
        return request(app)
            .post(route)
            .send({row: 5})
            .expect(400)
    })

    it('should fail if coords <= 0', () => {
        return request(app)
            .post(route)
            .send({row: 2, col: -1})
            .expect(400)
    })

    it('should fail if coords are not integers', () => {
        return request(app)
            .post(route)
            .send({row: 'hello', col: 2})
            .expect(400)
    })
})