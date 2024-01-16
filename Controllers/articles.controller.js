const { selectArticleById, selectAllArticles } = require('../Models/articles.model.js');

exports.getArticleById = async (request, response, next) => {
    const { article_id } = request.params;

    try {
        const article = await selectArticleById(article_id);
        response.status(200).json({ article });
    } catch (error) {
        if (error.status === 404) {
            response.status(404).json({ msg: 'Article not found' });
        } else {
            console.error('Error getting article by ID:', error);
            next(error);
        }
    }
};

exports.getAllArticles = async (request, response, next) => {
    const { sort_by } = request.query;
    try {
        const articles = await selectAllArticles(sort_by);
        response.status(200).json({ articles });
    } catch (error) {
        if (error.status === 404) {
            response.status(404).json({ msg: "Article not found" });
        } else {
            console.error('Error getting all articles:', error);
            next(error);
        }
    }
};

