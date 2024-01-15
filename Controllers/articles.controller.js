const { selectArticleById } = require('../Models/articles.model.js');

exports.getArticleById = async (request, response, next) => {
    const { article_id } = request.params;
    try {
        const article = await selectArticleById(article_id);
        if(!article) {
            return response.status(404).json({ msg: 'Article not found'});
        }
        response.status(200).json({ article });
    } catch (error) {
        console.error('Error getting article by ID:', error);
        next(error);
    }
}