const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed")

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(testData);
})

describe("/api/topics", () => {
    it("200: GET /api/topics should return an array of topics", async () => {
        const response = await request(app).get('/api/topics');
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('topics');
        expect(response.body.topics).toBeInstanceOf(Array);
    });
})