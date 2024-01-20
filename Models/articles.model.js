const db = require('../db/connection.js');

exports.selectArticleById = async (article_id) => {
    const result = await db.query(`
        SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.body, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.author,  
            articles.title,  
            articles.article_id, 
            articles.topic, 
            articles.body, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url;`, [article_id]);
    if(result.rows.length === 0) {
        const error = new Error('Article not found');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

exports.selectAllArticles = async (sort_by, topic) => {
    const allowedSortColumns = ['created_at'];
    if (sort_by && !allowedSortColumns.includes(sort_by)) {
        const error = new Error('Invalid sort_by parameter');
        error.status = 404; 
        throw error;
    }
    let query = `
        SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.author) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    const queryParams = [];
    if (topic) {
        query += ` WHERE articles.topic = $1`;
        queryParams.push(topic);
    }

    query += `
        GROUP BY articles.author,  
            articles.title,  
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url`;

    if (sort_by) {
        query += ` ORDER BY ${sort_by} DESC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        const error = new Error('Article not found');
        error.status = 404;
        throw error;
    }
    return result.rows;
};


exports.checkArticleExists = async (article_id) => {
    const articleIdAsInt = parseInt(article_id);
    if (isNaN(articleIdAsInt) || articleIdAsInt <= 0) {
        throw new Error('Invalid article_id');
    }
    const result = await db.query('SELECT COUNT(*) FROM articles WHERE article_id = $1', [articleIdAsInt]);
    return parseInt(result.rows[0].count) > 0;
};

exports.patchArticles = async (article_id, votes) => {
    const result = await db.query(`
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *`, [votes, article_id]);
    return result.rows[0];
}