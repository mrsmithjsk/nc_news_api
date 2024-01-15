const express = require('express');
const { getAllTopics, getAllEndPoints } = require('./Controllers/topics.controller.js');
const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndPoints);

module.exports = app;