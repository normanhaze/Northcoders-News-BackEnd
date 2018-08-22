const { User, Article, Comment } = require('../models');

const getArticles = (req, res, next) => {
    return Promise.all([
        Article.find().populate("created_by").lean(),
        Comment.find()
    ])
    .then(([articles, comments]) => {
        const commentCount = comments.reduce((acc, comment) => {
            let articleId = comment.belongs_to;
            if (acc[articleId]) acc[articleId]++;
            else acc[articleId] = 1;
            return acc;
        }, {});
        const all_articles = articles.map(article => { 
            return {...article, comment_count: commentCount[article._id] || 0} 
        });
        res.status(200).send({ all_articles });
        })
    .catch(next);
};

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    Article.findById(article_id).populate("created_by").lean()
    .then(article => {
        if (article === null) throw ({ status: 404, message: `Article ${article_id} not found` });
        else return Promise.all([
            article,
            Comment.find({ belongs_to: article_id })
        ])
        .then(([article, comments]) => {
            const articleWithComments = {...article, comment_count: comments.length}
            res.status(200).send({ article: articleWithComments })
        })  
    })
    .catch(err => {
        if (err.name === 'CastError') err.status = 400;
        next(err);
    });
};


const getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    Article.findById(article_id)
    .then(article => { 
        if (article === null) throw {status: 404, message: `Article ${article_id} not found` };
        return Comment.find({ belongs_to: article_id }).populate("created_by").populate("belongs_to")
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
    User.findById(req.body.created_by)
    .then(user => {
        if (user === null) throw {status: 404, message: `User ${req.body.created_by} not found`};
        return Article.findById(article_id)
    })
    .then(article => {
        if (article === null) throw {status: 404, message: `Article ${article_id} not found`};
        return Comment.create({
            ...req.body,
            belongs_to: article_id
        });
    })
    .then(comment => {
        res.status(201).send({message: 'Comment successfully added!', comment})
    })
    .catch(err => {
        if (err.name === 'ValidationError' || err.name === 'CastError') err.status = 400;
        next(err)
    });
};

const voteArticle = (req, res, next) => {
    const { article_id } = req.params;
    let vote = 0;
    if (req.query.vote === 'up') vote = +1;
    else if (req.query.vote === 'down') vote = -1;
    Article.findByIdAndUpdate(article_id, { $inc: { votes: vote }}, { new: true })
    .then(article => {
        if (article === null) throw {status: 404, message: `Article ${article_id} not found` };
        else res.status(200).send({ article });
    })
    .catch(err => {
        if (err.name === 'CastError') err.status = 400;
        next(err);
    });
};

module.exports = { getArticles, getArticleById, getArticleComments, addComment, voteArticle };