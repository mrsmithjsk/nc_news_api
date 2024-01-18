const db = require('../db/connection.js');

exports.selectComments = async (article_id) => {
    const result = await db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id]);
    return result.rows;
};

const checkUserExists = async (username) => {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows.length > 0;
};

exports.addComment = async (article_id, username, body) => {
    if (!username || !body) {
        throw new Error('Username and body are required');
    }
    const userExists = await checkUserExists(username);
    if(!userExists) {
        throw new Error('Username does not exist');
    }
    const allowedProperties = ['article_id', 'username', 'body'];
    const unnecessaryProperties = Object.keys({article_id, username, body}).filter(property => !allowedProperties.includes(property));
    if(unnecessaryProperties.length>0) {
        console.error('Unnecessary property detected');
        throw new Error('Unnecessary property detected');
        
    }
    const result = await db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, author, body, article_id, created_at`, [username, body, article_id]);
    return result.rows[0];
};

exports.deleteComments = async (comment_id) => {
    console.log('Deleting comment with ID:', comment_id);
    const result = await db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id]);
    if (result.rows.length === 0) {
        const error = new Error('Comment does not exist');
        error.status = 404;
        throw error;
    }
    return result.rows;
};