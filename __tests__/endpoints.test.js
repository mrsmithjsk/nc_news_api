const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

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
        const topics = response.body.topics;
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach(topic => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
    });
    });
})

describe("GET /api", () => {
    it("should return accurate JSON object describing endpoints", async () => {
        const response = await request(app).get('/api');
        const expectedEndpoints = require('../endpoints.json')
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedEndpoints);
    });
    it("should have properties for each endpoint", async() => {
        const response = await request(app).get('/api');
        expect(response.body).toHaveProperty("GET /api/topics");
        expect(response.body).toHaveProperty("GET /api/articles");
    });
})

