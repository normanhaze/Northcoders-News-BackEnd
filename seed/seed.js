const mongoose = require('mongoose');
const { User, Article, Comment, Topic } = require('../models');
const { formatArticleData, formatCommentData } = require('../utils');

const seedDB = ({ topicData, userData, articleData, commentData }) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            Topic.insertMany(topicData),
            User.insertMany(userData)
        ])    
    })
    .then(([topicDocs, userDocs]) => {
        return Promise.all([
            topicDocs,
            userDocs,
            Article.insertMany(formatArticleData(articleData, userDocs))
        ])  
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
        return Promise.all([
            topicDocs,
            userDocs,
            articleDocs,
            Comment.insertMany(formatCommentData(commentData, articleDocs, userDocs))
        ])
    });
};

module.exports = seedDB;