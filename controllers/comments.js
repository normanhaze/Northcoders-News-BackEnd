const { Comment } = require('../models');

const voteComment = (req, res, next) => {
    const { comment_id } = req.params;
    let vote = 0;
    if (req.query.vote === 'up') vote = +1;
    else if (req.query.vote === 'down') vote = -1;
    Comment.findByIdAndUpdate(comment_id, { $inc: { votes: vote }}, { new: true })
    .then(comment => {
        if (comment) res.status(200).send({ comment })
        else throw {status: 404};
    })
    .catch(err => {
        if (err.name === 'CastError') err.status = 400;
        else if (err.status === 404) err.message = 'Comment not found';
        next(err);
    });
};

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    Comment.findByIdAndDelete(comment_id)
    .then((comment) => {
        if (comment) res.status(200).send({message: 'Comment deleted'});
        else throw { status: 404 }  
    })
    .catch(err => {
        if (err.name === 'CastError') err.status = 400;
        else if (err.status === 404) err.message = 'Comment not found';
        next(err);
    });
};

module.exports = { voteComment, deleteComment };