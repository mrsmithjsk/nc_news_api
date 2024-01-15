const db = require('../db/connection.js');

exports.selectTopics = async (request, response) => {
    const result = await db.query('SELECT * FROM topics;')
    return result.rows;
};


