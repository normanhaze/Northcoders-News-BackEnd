# Northcoders News
Northcoders News is a news and blogging site. The following instructions will allow you to create an API and seed a MongoDB database of news articles, users, comments and topics. 

The API includes pathways to view articles, users, topics and comments, add and vote on articles and comments, and delete comments. Details of all available routes can be found on the '/api' route.

[Here is a link to a hosted version of the application.](https://hn-northcoders-news.herokuapp.com/api)

## Getting Started

### Prerequisites
To set up the API, you will need [Node](https://nodejs.org/en/download/) and [Mongo](https://docs.mongodb.com/manual/installation/) installed on your machine. Follow the links for instructions on how to do this.

### Installing
Fork and clone the [repository from Github](https://github.com/normanhaze/BE-FT-northcoders-news). 

Navigate into the directory on your command line and run ```npm install``` to install the required dependencies. These are as follows:
* Express
* Mongoose
* Body-parser
* Mocha
* Chai
* Supertest
* Nodemon

### Config

You will need to set up a ```config``` file to connect to your MongoDB databases. A test database should seeded rather than the main database if the process.env.NODE_ENV is set to "test".

The below is an example of how to set your file to host the API locally:
```js 
const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
    development: {
        DB_URL: 'mongodb://localhost:27017/northcoders_news'
    },
    test: {
        DB_URL: 'mongodb://localhost:27017/northcoders_news_test'
    }
}

module.exports = config[NODE_ENV];
```
### Seeding your database
Run ```mongod``` in the command line to connect to MongoDB. Once it is connected it should say "waiting for connections on port 27017". This should be left running - open another tab to continue using the command line.

If the database is not connecting, try closing and reopening your terminal or killing the process. If it loses connection while you're using it, use Control+C to exit and then run ```mongod``` again.

Run ```npm run seed``` in the command line to seed your dev database. "Database seeding successful" will be logged to the console once the seeding has been completed.

### Running the Server
Run ```npm start``` in the command line to run your server. "Connected to Mongo" and "listening on port" will log to the console if configured correctly. Requests can now be made to the server.

## Testing
With MongoDB connected, run ```npm test``` in the command line to run the provided tests. These tests check the endpoints for each route, including errors for bad requests and bad routes. The test database will be reseeded before each test to ensure consistency.

If the test responses are not as expected, check that you have successfully set up your config file so that the test data is being used, not the dev data.

## Authors
Hazel Normandale - *Student at Northcoders*

Data, models and support provided by the Northcoders team.