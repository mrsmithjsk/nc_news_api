const { selectArticleById, selectAllArticles, patchArticles } = require('../Models/articles.model.js');

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
    const { sort_by, topic } = request.query;
    try {
        const articles = await selectAllArticles(sort_by, topic);
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

exports.patchArticleById = async (request,response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    try {
        if(inc_votes === undefined || typeof inc_votes !== 'number') {
            const error = new Error('Invalid inc_votes value');
            error.status = 400;
            throw error;
        }
        const updatedArticle = await patchArticles(article_id, inc_votes);
        if(!updatedArticle) {
            const error = new Error('Article not found');
            error.status = 404;
            throw error;
        }
        response.status(200).json({ article: updatedArticle });
    } catch (error) {
        console.error('Error updating all votes:', error);
        response.status(error.status || 500).json({ error: error.message });
        next(error);
    }
}