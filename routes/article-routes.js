const articleRouter = require('express').Router();
const { getArticles, getArticleById, getArticleComments, addComment } = require('../controllers/articles');

articleRouter.route('/')
.get(getArticles);

articleRouter.route('/:article_id')
.get(getArticleById);

articleRouter.route('/:article_id/comments')
.get(getArticleComments)
.post(addComment);

module.exports = articleRouter;