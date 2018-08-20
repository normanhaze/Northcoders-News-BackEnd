
const getId = (arr, property, match) => {
    return arr.find(item => item[property] === match)._id;
};

const formatArticleData = (articleData, userData) => {
    return articleData.map(article => {
        const created_by = getId(userData, 'username', article.created_by);
        return {
            ...article,
            created_by,
            belongs_to: article.topic
        };
    });
};

const formatCommentData = (commentData, articleDocs, userDocs) => {
    return commentData.map(comment => {
        const created_by = getId(userDocs, 'username', comment.created_by);
        const belongs_to = getId(articleDocs, 'title', comment.belongs_to);
        return {
            ...comment,
            created_by,
            belongs_to
        };
    });
};

module.exports = { formatArticleData, formatCommentData };