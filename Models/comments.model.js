const db = require('../db/connection.js');

exports.selectComments = async (article_id) => {
    const result = await db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id]);
    return result.rows;
};

