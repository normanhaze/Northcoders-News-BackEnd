const apiHomepage = (req, res, next) => {
    res.status(200).send({
        "GET /api/topics" : "Get all the topics",
        "GET /api/topics/:topic/articles" : "Return all the articles for a certain topic",
        "GET /api/articles" : "Returns all the articles",
        "GET /api/articles/:article_id/comments" : "Get all the comments for a individual article",
        "POST /api/articles/:article_id/comments" : `Add a new comment to an article. This route requires a JSON body with a body key and value pair and a created_by key with a value pair of a valid user id. e.g: {"body": "This is my new comment", created_by": "<mongo id for user>}"`,
        "PUT /api/articles/:article_id" : "Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down', e.g: /api/articles/:article_id?vote=up",
        "PUT /api/comments/:comment_id" : "Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down', e.g: /api/comments/:comment_id?vote=down",
        "DELETE /api/comments/:comment_id" : "Deletes a comment",
        "GET /api/users/:username" : "Returns a JSON object with the profile data for the specified user."
    })
    .catch(err => next(err));
}


module.exports = apiHomepage;
