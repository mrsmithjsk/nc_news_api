const express = require('express');
const { getAllTopics, getAllEndPoints } = require('./Controllers/topics.controller.js');
const { getArticleById, getAllArticles } = require('./Controllers/articles.controller.js');
const { getAllCommentsFromID } = require('./Controllers/comments.controller.js')

const app = express();

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndPoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getAllArticles);
app.get("/api/articles/:article_id/comments", getAllCommentsFromID);

module.exports = app;