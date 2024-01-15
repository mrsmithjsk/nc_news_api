const db = require('../db/connection.js');

exports.selectTopics = async (request, response) => {
    try {
    const result = await db.query('SELECT * FROM topics;')
    return result.rows;
    } catch(error) {
        console.log("Error selecting topics:", error);
        throw error;
    }
};