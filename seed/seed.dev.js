const mongoose = require('mongoose');
const data = require('./devData');
const seedDB = require('./seed');
const { DB_URL } = require('../config');

mongoose.connect(DB_URL, { useNewUrlParser: true })
.then(() => seedDB(data))
.then(() => console.log("Database seeding successful"))
.catch(console.error)
.finally(()=> mongoose.disconnect());