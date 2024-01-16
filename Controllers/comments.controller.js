const { selectComments } = require('../Models/comments.model.js');
const { selectArticleById } = require('../Models/articles.model.js');

exports.getAllCommentsFromID = async (request, response, next) => {
    const { article_id } = request.params;
    try {
        const comments = await selectComments(article_id);
        const article = await selectArticleById(article_id);
        if(!article) {
            return response.status(404).json({ msg:'Comment not found' });
        }
        response.status(200).json({ comments });
    } catch (error) {
        console.error('Error getting comments:', error);
        if (error.message === 'Article not found') {
            return response.status(404).json({ msg: 'Comment not found' });
        }
        next(error);
    }
};

