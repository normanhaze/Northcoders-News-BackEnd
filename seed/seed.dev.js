const mongoose = require('mongoose');
const data = require('./devData');
const seedDB = require('./seed');
const DB_URL = process.env.DB_URL || require('../config').DB_URL;

mongoose.connect(DB_URL, { useNewUrlParser: true })
.then(() => seedDB(data))
.then(() => console.log("Database seeding successful"))
.finally(()=> mongoose.disconnect())
.catch(console.error);