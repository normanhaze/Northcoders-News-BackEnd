const topicRouter = require('express').Router();
const { getTopics, getArticlesByTopic, addArticleByTopic } = require('../controllers/topics');

topicRouter.route('/')
    .get(getTopics);

topicRouter.route('/:topic_slug/articles')
    .get(getArticlesByTopic)
    .post(addArticleByTopic);

module.exports = topicRouter;