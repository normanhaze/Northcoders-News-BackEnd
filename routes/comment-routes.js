const commentRouter = require('express').Router();
const { voteComment, deleteComment } = require('../controllers/comments');

commentRouter.route('/:comment_id')
    .put(voteComment)
    .delete(deleteComment);

module.exports = commentRouter;