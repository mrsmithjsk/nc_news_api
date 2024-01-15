const express = require('express');
const { getAllTopics } = require('./Controllers/topics.controller');
const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics)

const PORT = process.env.PORT || 9090;
app.listen(PORT, (error) => {
    if(error) {
        console.log(error)
    } else {
    console.log(`Server is running on port ${PORT}`);
};
})

module.exports = app;