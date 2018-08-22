process.env.NODE_ENV = 'test';
const app = require('../app');
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest')(app);
const data = require('../seed/testData');
const seedDB = require('../seed/seed');


describe('/api', () => {
    let topics, users, articles, comments;
    beforeEach(() => {
        return seedDB(data)
        .then(docs => {
            [topics, users, articles, comments] = docs
        });
    });
    after(() => mongoose.disconnect());
    it('first user returned is jonny', () => {
        const jonny = users[0];
        expect(jonny.name).to.equal('jonny');
    });
    it('GET request to non-existent path returns 404', () => {
        return request.get('/hello')
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal("Page Not Found");
        });
    });
    it('GET request to non-existent api path returns 404', () => {
        return request.get('/api/hello')
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal("Page Not Found");
        });
    });
    it('GET /api/topics returns all topics', () => {
        return request.get('/api/topics')
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.topics.length).to.equal(2);
            expect(res.body.topics[0]).to.include.keys('_id', 'slug', 'title');
            expect(res.body.topics[0].slug).to.equal('mitch');
        });
    });
    it('GET /api/topics/:topic_slug/articles returns all articles belonging to a specific topic', () => {
        return request.get('/api/topics/mitch/articles')
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.articles.length).to.equal(2);
            expect(res.body.articles[0]).to.include.keys('belongs_to', 'body','comment_count', 'created_at', 'created_by', 'title','votes');
            expect(res.body.articles[0].title).to.equal("Living in the shadow of a great man");
        });
    });
    it('GET /api/topics/:topic_slug/articles returns a 404 if the topic is not listed', () => {
        return request.get('/api/topics/balloons/articles')
        .expect(404)
        .then(res => {
            expect(res.body.message).to.equal("No articles found with topic \"balloons\"");
        });
    });
    it('POST /api/topics/:topic_slug/articles returns 201 for a valid post request', () => {
        return request
        .post('/api/topics/mitch/articles')
        .send({
            title: "Who is he?",
            body: "A tutor at Northcoders",
            created_by: users[0]._id
        })
        .expect(201)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.article).to.include.keys('_id', 'title', 'body', 'created_by', 'votes', 'created_at', 'belongs_to');
            expect(res.body.article.belongs_to).to.equal('mitch');
            expect(res.body.article.title).to.equal('Who is he?');
        });
    });
    it('POST /api/topics/:topic_slug/articles returns 400 for an invalid key in a post request', () => {
        return request
        .post('/api/topics/mitch/articles')
        .send({
            name: "Who is he?",
            body: "A tutor at Northcoders",
            created_by: users[0]._id
        })
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('POST /api/topics/:topic_slug/articles returns 404 when the ObjectId does not exist in the collection', () => {
        return request
        .post('/api/topics/mitch/articles')
        .send({
            name: "Who is he?",
            body: "A tutor at Northcoders",
            created_by: "5b6329b3f16f435af91d4ebd"
        })
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('User not found');
        });
    });
    it('GET /api/articles returns all articles', () => {
        return request.get('/api/articles')
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.all_articles.length).to.equal(5);
            expect(res.body.all_articles[0]).to.include.keys('belongs_to', 'body','comment_count', 'created_at', 'created_by', 'title','votes');
            expect(res.body.all_articles[2].title).to.equal(`They're not exactly dogs, are they?`); 
        });
    });
    it('GET /api/articles/:article_id retrieves a single article', () => {
        return request.get(`/api/articles/${articles[1]._id}`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.article).to.be.a('object');
            expect(res.body.article).to.include.keys('belongs_to', 'body','comment_count', 'created_at', 'created_by', 'title','votes');
            expect(res.body.article.body).to.equal("Who are we kidding, there is only one, and it's Mitch!");

        });
    });
    it('GET /api/articles/:article_id returns a 400 for an invalid ObjectId', () => {
        return request.get('/api/articles/balloons')
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('GET /api/articles/:article_id returns a 404 when the ObjectId does not exist in the collection', () => {
        return request.get('/api/articles/5b6329b3f16f435af91d4ebe')
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Article 5b6329b3f16f435af91d4ebe not found');
        });
    });
    it('GET /api/articles/:article_id/comments retrieves all comments for an article', () => {
        return request.get(`/api/articles/${articles[1]._id}/comments`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.comments.length).to.equal(2);
            expect(res.body.comments[0]).to.include.keys('_id', 'body', 'created_by', 'belongs_to', 'created_at', 'votes')
            expect(res.body.comments[0].votes).to.equal(19);
        });
    });
    it('GET /api/articles/:article_id/comments returns 404 if an article has no comments', () => {
        return request.get(`/api/articles/${articles[4]._id}/comments`)
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal(`No comments found for article ${articles[4]._id}`);
        });
    });
    it('GET /api/articles/:article_id/comments returns 404 when the ObjectId does not exist in the collection', () => {
        return request.get(`/api/articles/5b6329b2f16f435af91d4eb8/comments`)
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Article 5b6329b2f16f435af91d4eb8 not found');
        });
    });
    it('GET /api/articles/:article_id/comments returns 400 for an invalid ObjectId', () => {
        return request.get(`/api/articles/article123/comments`)
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('POST /api/articles/:article_id/comments returns 201 for a valid post request', () => {
        return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
            body: "Who reads this stuff anyway lol",
            created_by: users[0]._id
        })
        .expect(201)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.comment).to.include.keys('_id', 'body', 'created_by', 'votes', 'created_at', 'belongs_to');
            expect(res.body.comment.body).to.equal('Who reads this stuff anyway lol');
            expect(res.body.comment.votes).to.equal(0);
        });
    });
    it('POST /api/articles/:article_id/comments returns 400 for an invalid key in a post request', () => {
        return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
            comment: "Who reads this stuff anyway lol",
            created_by: users[0]._id
        })
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('POST /api/articles/:article_id/comments returns 400 for an invalid ObjectId for user', () => {
        return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
            body: "Who reads this stuff anyway lol",
            created_by: 'me'
        })
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('POST /api/articles/:article_id/comments returns 400 for an invalid ObjectId for article', () => {
        return request
        .post(`/api/articles/article123/comments`)
        .send({
            body: "Who reads this stuff anyway lol",
            created_by: users[0]._id
        })
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Cast to ObjectId failed for value "article123" at path "_id" for model "articles"');
        });
    });
    it('POST /api/articles/:article_id/comments returns 404 when the ObjectId for article does not exist in the collection', () => {
        return request
        .post(`/api/articles/5b6329b3f16f435af91d4ebf/comments`)
        .send({
            body: "Who reads this stuff anyway lol",
            created_by: users[0]._id
        })
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Article 5b6329b3f16f435af91d4ebf not found');
        });
    });
    it('POST /api/articles/:article_id/comments returns 404 when the ObjectId for user does not exist in the collection', () => {
        return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
            body: "Who reads this stuff anyway lol",
            created_by: "5b6329b3f16f435af91d4ebf"
        })
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('User 5b6329b3f16f435af91d4ebf not found');
        });
    });
    it('PUT /api/articles/:article_id?vote=up returns 200 and increases votes by 1', () => {
        return request
        .put(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.article.votes).to.equal(1);
        });
    });
    it('PUT /api/articles/:article_id?vote=down returns 200 and decreases votes by 1', () => {
        return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.article.votes).to.equal(-1);
        });
    });
    it('PUT /api/articles/:article_id?vote=hello returns 200 and unchanged object if query value is invalid', () => {
        return request
        .put(`/api/articles/${articles[0]._id}?vote=hello`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.article.votes).to.equal(0);
        });
    });
    it('PUT /api/articles/:article_id?vote=down returns 400 for an invalid ObjectId', () => {
        return request
        .put(`/api/articles/comment123?vote=down`)
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('PUT /api/articles/:article_id?vote=down returns 404 when the ObjectId does not exist in the collection', () => {
        return request
        .put(`/api/articles/5b6329b3f16f435af91d4ec0?vote=down`)
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Article 5b6329b3f16f435af91d4ec0 not found');
        });
    });
    it('PUT /api/comments/:comment_id?vote=up returns 200 and increases votes by 1', () => {
        return request
        .put(`/api/comments/${comments[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.comment.votes).to.equal(8);
        });
    });
    it('PUT /api/comments/:comment_id?vote=down returns 200 and decreases votes by 1', () => {
        return request
        .put(`/api/comments/${comments[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.comment.votes).to.equal(6);
        });
    });
    it('PUT /api/comments/:comment_id?vote=hello returns 200 and unchanged object if query value is invalid', () => {
        return request
        .put(`/api/comments/${comments[0]._id}?vote=hello`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.comment.votes).to.equal(7);
        });
    });
    it('PUT /api/comments/:comment_id?vote=down returns 400 for an invalid ObjectId', () => {
        return request
        .put(`/api/comments/comment123?vote=down`)
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('PUT /api/comments/:comment_id?vote=down returns 404 when the ObjectId does not exist in the collection', () => {
        return request
        .put(`/api/comments/5b6329b3f16f435af91d4ec0?vote=down`)
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Comment 5b6329b3f16f435af91d4ec0 not found');
        });
    });
    it('GET /api/users/:username returns data about a specific user', () => {
        return request.get('/api/users/butter_bridge')
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.user).to.include.keys("username", "name", "avatar_url");
            expect(res.body.user.name).to.equal("jonny");
        });
    });
    it('GET /api/users/:username returns a 404 if the username does not exist', () => {
        return request.get('/api/users/user123')
        .expect(404)
        .then(res => {
            expect(res.body.message).to.equal("User user123 not found");
        });
    });
    it('DELETE /api/comments/:comment_id returns 200 and success message when comment is deleted, and is not returned for subsequent GET requests', () => {
        return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(200)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Comment deleted');
        })
        .then(() => {
        return request
        .get(`/api/articles/${articles[0]._id}/comments`)
            .expect(200)
            .then(res => {
                expect(res.body.comments.length).to.equal(1);
            });
        });
    });
    it('DELETE /api/comments/:comment_id returns 400 for an invalid ObjectId', () => {
        return request
        .delete(`/api/comments/comment123`)
        .expect(400)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.exist;
        });
    });
    it('DELETE /api/comments/:comment_id returns 404 when the ObjectId does not exist in the collection', () => {
        return request
        .delete(`/api/comments/5b6329b3f16f435af91d4ec0`)
        .expect(404)
        .then(res => {
            expect(res.body).to.be.a('object');
            expect(res.body.message).to.equal('Comment 5b6329b3f16f435af91d4ec0 not found');
        });
    });
});