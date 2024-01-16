const db = require('../db/connection.js');

exports.selectArticleById = async (article_id) => {
    const result = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]);
    if(result.rows.length === 0) {
        const error = new Error('Article not found');
        error.status = 404;
        throw error;
    }
    return result.rows[0];
};

exports.selectAllArticles = async (sorted_by) => {
    const allowedSortColumns = ['created_at'];
    if (sorted_by && !allowedSortColumns.includes(sorted_by)) {
        const error = new Error('Invalid sort_by parameter');
        error.status = 404;
        throw error;
    }
    const sortedOrder = sorted_by || "DESC";
    const result = await db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.author) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.author,  articles.title,  articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
    ORDER BY created_at ${sortedOrder};
    `);
    if(result.rows.length === 0) {
        const error = new Error('Article not found');
        error.status = 404;
        throw error;
    }
    return result.rows;
};