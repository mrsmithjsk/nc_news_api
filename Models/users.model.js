const db = require('../db/connection.js');

exports.getUsers = async () => {
    const result = await db.query('SELECT * FROM users');
    return result.rows;
};