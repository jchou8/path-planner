const app = require('../app')
const request = require('supertest')
const route = '/api/paths'

describe('Test /api/paths', () => {
    // Make sure map is created first
    beforeAll(() => {
        return request(app)
            .post('/api/maps')
            .send({ row: 5, col: 5 })
    })
    
    it('should not respond to a method other than GET', () => {
        return request(app)
            .post(route)
            .expect(404)
    })
})