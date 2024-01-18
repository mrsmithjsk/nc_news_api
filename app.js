const express = require('express');
const { getAllTopics, getAllEndPoints } = require('./Controllers/topics.controller.js');
const { getArticleById, getAllArticles, patchArticleById } = require('./Controllers/articles.controller.js');
const { getAllCommentsFromID, postCommentById, deleteCommentById } = require('./Controllers/comments.controller.js');
const { getAllUsers } = require('./Controllers/users.controller.js');

const app = express();
app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndPoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsFromID);
app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postCommentById);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

module.exports = app;