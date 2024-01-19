const { selectComments, addComment, deleteComments } = require('../Models/comments.model.js');
const { selectArticleById, checkArticleExists } = require('../Models/articles.model.js');

exports.getAllCommentsFromID = async (request, response, next) => {
    const { article_id } = request.params;
    if (!/^\d+$/.test(article_id)) {
        return response.status(400).json({ error: 'Invalid article ID' });
    }
    try {
        const comments = await selectComments(article_id);
        const article = await selectArticleById(article_id);
        if(!article) {
            return response.status(404).json({ msg:'Comment not found' });
        }
        response.status(200).json({ comments });
    } catch (error) {
        //('Error getting comments:', error);
        if (error.message === 'Article not found') {
            return response.status(404).json({ msg: 'Comment not found' });
        }
        next(error);
    }
};

exports.postCommentById = async (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;
    //console.log('Request Body:', request.body);
    try {
        const articleExists = await checkArticleExists(article_id);
        if (!articleExists) {
            response.status(404).json({ error: 'Article not found' });
            return;
        }
        const comment = await addComment(article_id, username, body);
        response.status(201).json({ comment });
    } catch (error) {
        //('Error posting comment:', error);

        if (error.message === 'Username and body are required') {
            response.status(400).json({ error: 'Username and body are required' });
        } else if (error.message === 'Username does not exist') {
            response.status(400).json({ error: 'Username does not exist' });
        } else if (error.message === 'Invalid article_id') {
            response.status(404).json({ error: 'Invalid article_id' });
        } else {
            response.status(500).json({ error: 'Internal Server Error' });
        }
        next(error);
    }
};

exports.deleteCommentById = async (request, response, next) => {
    const { comment_id } = request.params;
    try {
        if (!comment_id || isNaN(comment_id)) {
            const error = new Error('Invalid comment_id');
            error.status = 400;
            throw error;
        }
        await deleteComments(comment_id)
        response.status(204).send();
    } catch (error) {
        //('Error deleting comment:', error);
        if (error.status === 400) {
            response.status(400).json({ error: 'Invalid comment_id' });
        } else if (error.status === 404) {
            response.status(404).json({ error: 'Comment does not exist' });
        } else {
            response.status(500).json({ error: 'Error deleting comment' });
        }
        next(error);
    }
};
