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

describe("/api/articles/:article_id/comments", () => {
    it("The endpoint will respond with an array", async () => {
        const response = await request(app).get("/api/articles/9/comments");
        expect(response.status).toBe(200);
        const { body } = response;
        expect(Array.isArray(body.comments)).toBe(true);
    });
    it("should return an array of comments from the given article ID", async () => {
        const response = await request(app).get("/api/articles/1/comments");
        expect(response.status).toBe(200);
        const { body } = response;
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(comment.article_id).toBe(1);
        });
    });
    it('should return 200 status code and an empty array given valid ID by not comment', async () => {
        const response = await request(app).get("/api/articles/2/comments");
        expect(response.status).toBe(200);
        const { body } = response;
        expect(body.comments).toEqual([]);
    });
    it("should return 404 given a valid article ID but no comment", async () => {
        const response = await request(app).get("/api/articles/555667/comments")
        expect(response.status).toBe(404);
        const { body } = response;
        expect(body.msg).toBe("Comment not found");
    });
    it('should return 400 for an invalid article ID when getting comments', async () => {
        const response = await request(app).get('/api/articles/not-an-id/comments');
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Invalid article ID' });
    });
})

describe('Post /api/articles/:article_id/comments', () => {
    it('should add a comment to an article', async () => {
        const response = await request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'This is a test comment',
            });
        expect(response.status).toBe(201);
        const { comment } = response.body;
        expect(comment).toHaveProperty('comment_id');
        expect(comment).toHaveProperty('author', 'butter_bridge');
        expect(comment).toHaveProperty('body', 'This is a test comment');
        expect(comment).toHaveProperty('article_id', 1);
    });
    it('should return for a valid but non-existent article', async () => {
        const response = await request(app)
            .post('/api/articles/999/comments')
            .send({
                username: 'butter_bridge',
                body: 'This is a test comment',
            });
        expect(response.status).toBe(404);
    });
    it('should handle missing username or body', async () => {
        const response = await request(app)
          .post('/api/articles/1/comments')
          .send({
            
          });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Username and body are required');
    });
    // it.only('should throw an error for unnecessary properties', async () => {
    //     const response = await request(app)
    //       .post('/api/articles/1/comments')
    //       .send({
    //             username: 'butter_bridge',
    //             body: 'This is a test comment',
    //             unnecessaryProperty: 'extra',
    //         });
    //     console.log('Response Body:', response.body);
    //     console.log('Response Status:', response.status);
    //     expect(response.status).toBe(201);
    //     expect(response.body.error).toBe('Unnecessary property detected');
    // });
    // it.only('should throw an error for an invalid article_id', async () => {
    //     const response = await request(app)
    //     .post('/api/articles/9999999/comments')
    //     .send({
    //         username: 'butter_bridge',
    //         body: 'This is a test comment',
    //     });
    //     console.log('Response Body:', response.body);
    //     console.log('Response Status:', response.status);
    //     expect(response.status).toBe(404);
    //     expect(response.bodyerror).toBe('Article not found');
    // });
    it('should throw an error if the username does not exist', async () => {
        const response = await request(app)
        .post('/api/articles/1/comments')
        .send({
            username: 'testuser',
            body: 'This is a test comment',
            unnecessaryProperty: 'extra',
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Username does not exist');
    })
    
})

describe('Patch /api/articles/:article_id', () => {
    it('should increment article votes with a valid inc_votes value', async () => {
        const response = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('article');
        expect(response.body.article).toHaveProperty('votes', 101);
    });
    it('should decrement article votes with a valid inc_votes value', async () => {
        const response = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -1 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('article');
        expect(response.body.article).toHaveProperty('votes', 99);
    });
    it('should return 400 for an invalid inc_votes value', async () => {
        const response = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'invalid' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Invalid inc_votes value' });
    });
    it('should return 404 for a non-existing article', async () => {
        const response = await request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 5 });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Article not found');
    });
})

describe('Delete /api/comments/:comment_id', () => {
    it('should return an empty object upon sucessful deletion', async () => {
        const response = await request(app).delete('/api/comments/1');
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    })
    it('should return 404 for a non-existing comment', async () => {
        const response = await request(app).delete('/api/comments/999');
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ error: 'Comment does not exist' })
    })
    it('should return 400 for an invalid comment', async () => {
        const response = await request(app).delete('/api/comments/invalid');
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: 'Invalid comment_id' });
    })
})

describe('Get /api/users', () => {
    it('should return users with the correct properties', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(4)
        response.body.forEach((user) => {
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('avatar_url');
        })
    });
})

describe('Further GET /api/users', () => {
    it("should return articles filtered by topic", async () => {
        const response = await request(app).get("/api/articles?topic=mitch");
        expect(response.status).toBe(200);
        expect(response.body.articles.length).toBe(12);
        const articles = response.body.articles;
        articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
        });
    });
    it("should return 404 for a non-existent topic", async () => {
        const response = await request(app).get("/api/articles?topic=nonexistenttopic");
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ msg: 'Article not found' });
    });
    it("should return 404 if no articles found for a valid topic", async () => {
        const response = await request(app).get('/api/articles?topic=paper');
        console.log(response.body);
        expect(response.status).toBe(404); 
        expect(response.body).toEqual({ msg: 'Article not found' });
    });

})

describe('Further GET /api/articles/:article_id', () => {
    it('should return an article with comment_count when a valid article_id is provided', async () => {
        const response = await request(app).get('/api/articles/1');
        expect(response.status).toBe(200);
        expect(response.body.article).toHaveProperty('comment_count');
        const commentCount = parseInt(response.body.article.comment_count, 10);
        expect(typeof commentCount).toBe('number');
    });
    it("should return 404 and an error message when the provided article_id does not exist", async () => {
        const response = await request(app).get('/api/articles/999'); 
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ msg: 'Article not found' });
    });
})