const apiRouter = require('express').Router();
const articleRouter = require('./article-routes');
const topicRouter = require('./topic-routes');
const userRouter = require('./user-routes');
const commentRouter = require('./comment-routes');
const apiHomepage = require('../controllers/apiHomepage');

apiRouter.route('/').get(apiHomepage);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);

module.exports = apiRouter;