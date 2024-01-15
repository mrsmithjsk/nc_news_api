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
        expect(topics.length).toBe(3);
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
})

describe("GET /api/articles/:article_id", () => {
    it("should return an article by ID", async () => {
        const response = await request(app).get('/api/articles/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('article')
    })
    it("should return 404 if invalid article ID", async () => {
        const response = await request(app).get('/api/articles/9999');
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe('Article not found')
    })
})

