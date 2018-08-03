const { Article, Comment } = require('../models');

const getArticles = (req, res, next) => {
    Article.find()
    .then(articles => res.status(200).send({ articles }))
    .catch(err => next(err));
};

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    Article.findById(article_id)
    .then(article => {
        if (article !== null) res.status(200).send({ article })
        else throw ({ status: 404 })
    })
    .catch(err => {
        if (err.name === 'CastError') err.status = 400;
        else if (err.status === 404) err.message = `Article ${article_id} not found`;
        next(err);
    });
};

const getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    console.log(article_id);
    Article.findById(article_id)
    .then(article => { 
        if (article === null) throw {status: 404, message: `Article ${article_id} not found` };
        return Comment.find({ belongs_to: article_id })
        })
        .then(comments => {
            if (comments.length) res.status(200).send({ comments });
            else throw {status: 404, message: `No comments found for article ${article_id}` };
        })
        .catch(err => {
            if (err.name === "CastError") err.status = 400;
            next(err);
        });
};

const addComment = (req, res, next) => {
    const { article_id } = req.params;
    Article.findById(article_id)
    .then(article => {
        if (article === null) throw {status: 404 };
        return Comment.create({
            ...req.body,
            belongs_to: article_id
        })
        .then(comment => {
            res.status(201).send({message: 'Comment successfully added!', comment})
        })
        .catch(err => {
            if (err.name === 'ValidationError') err.status = 400;
            else if (err.status === 404) err.message = `Article ${article_id} not found`;
            next(err)
        })
    })
}

module.exports = { getArticles, getArticleById, getArticleComments, addComment };