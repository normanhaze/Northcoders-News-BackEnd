const { Topic, User, Article, Comment } = require('../models');

const getTopics = (req, res, next) => {
    Topic.find()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
}

const getArticlesByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    Article.find({ belongs_to: topic_slug }).populate("created_by").lean()
    .then((articles) => {
        return Promise.all([
            articles,
            ...articles.map(article => Comment.find({ belongs_to: article._id }))
        ])
    })
    .then(([topicArticles, ...comments]) => {
        const commentCount = comments.reduce((acc, comment, i) => {
            let articleId = topicArticles[i]._id;
            acc[articleId] = comment.length;
            return acc;
        }, {})
        const articles = topicArticles.map(article => {
            return {...article, comment_count: commentCount[article._id]};
        })
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
        return Promise.all([
            user,
            Article.create({ 
                ...req.body,
                belongs_to: topic_slug
            })
        ])
    })
    .then(([user, article]) => {
        res.status(201).send({ message: 'Article succesfully added!', article: {...article.toObject(), created_by: user} })
    })
    .catch(err => {
        if (err.name === 'ValidationError') err.status = 400;
        next(err);
    });
};

module.exports = { getTopics, getArticlesByTopic, addArticleByTopic };