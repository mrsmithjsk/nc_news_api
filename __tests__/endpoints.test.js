const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
//const jest-sorted = require('jest-sorted');

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(testData);
})

describe("/api/topics", () => {
    it("200: GET /api/topics should return an array of topics", async () => {
        const response = await request(app).get('/api/topics');
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
        const { article } = response.body;
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('body');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
    })
    it("should return 404 if invalid article ID", async () => {
        const response = await request(app).get('/api/articles/9999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'Article not found');
    })
})

describe("GET /api/articles", () => {
    it("should return all articles, with no body property, in ascending order sorted by date", async () => {
        const response = await request(app).get('/api/articles');
        expect(response.status).toBe(200);
        expect(response.body.articles.length).toBe(13);
        //expect(response.body).toBeSortedBy("created_at", {descending: true});
        const articles = response.body.articles;
        const sortedArticles = articles.slice().sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });
        expect(articles).toEqual(sortedArticles);
        articles.forEach((article) => {
            expect(article).not.toHaveProperty('body');
          });
    });
    it("each reply must respond with an object which includes author, title, article_id, etc", async () => {
        const response = await request(app).get("/api/articles");
        expect(response.status).toBe(200);
        expect(response.body.articles.length).toBe(13);
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
    });
    it('should return 404 if no articles found', async () => {
        const response = await request(app).get('/api/articles?sort_by=nonexistenttopic');
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ msg: 'Article not found' });
      });

})

