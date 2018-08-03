
const getIndex = (arr, property, match) => {
    return arr.findIndex(item => item[property] === match)
};

const formatArticleData = (articleData, userData) => {
    return articleData.map(article => {
        let userPosition = getIndex(userData, 'username', article.created_by);
        return {
            ...article,
            created_by: userData[userPosition]._id,
            belongs_to: article.topic
        };
    });
};

const formatCommentData = (commentData, articleDocs, userDocs) => {
    return commentData.map(comment => {
        let userPosition = getIndex(userDocs, 'username', comment.created_by);
        let articlePosition = getIndex(articleDocs, 'title', comment.belongs_to);
        return {
            ...comment,
            created_by: userDocs[userPosition]._id,
            belongs_to: articleDocs[articlePosition]._id
        };
    });
};

module.exports = { formatArticleData, formatCommentData };