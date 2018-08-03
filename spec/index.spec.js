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
            //console.log(users);
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
            expect(res.body.message).to.equal("Page Not Found");
        });
    });
    it('GET request to non-existent api path returns 404', () => {
        return request.get('/api/hello')
        .expect(404)
        .then(res => {
            expect(res.body.message).to.equal("Page Not Found");
        });
    });
    it('GET /api/topics returns all topics', () => {
        return request.get('/api/topics')
        .expect(200)
        .then(res => {
            expect(res.body.topics.length).to.equal(2);
            expect(res.body.topics[0].slug).to.equal('mitch');
        });
    });
    it('GET /api/topics/:topic_slug/articles works for a listed topic', () => {
        return request.get('/api/topics/mitch/articles')
        .expect(200)
        .then(res => {
            expect(res.body.articles.length).to.equal(2);
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
    it.only('POST /api/topics/:topic_slug/articles returns 201 for a valid post request', () => {
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
});