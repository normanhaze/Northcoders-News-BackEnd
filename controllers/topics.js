const { Topic, User, Article } = require('../models');

const getTopics = (req, res, next) => {
    Topic.find()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
}

const getArticlesByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    Article.find({ belongs_to: topic_slug })
    .then(articles => {
        if (articles.length) res.status(200).send({ articles });
        else next({status: 404, message: `No articles found with topic "${topic_slug}"`})
    })
    .catch(next);
}

const addArticleByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    User.findById(req.body.created_by)
    .then(user => {
        if (user === null) throw { status: 404, message: 'User not found' }; 
        return Article.create({ 
            ...req.body,
            belongs_to: topic_slug
        });
    })
    .then(article => {
        res.status(201).send({ message: 'Article succesfully added!', article })
    })
    .catch(err => {
        if (err.name === 'ValidationError') err.status = 400;
        next(err);
    });
};

module.exports = { getTopics, getArticlesByTopic, addArticleByTopic };