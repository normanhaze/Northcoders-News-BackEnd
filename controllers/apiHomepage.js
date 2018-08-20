const homepageData = require('../homePage.json')

const apiHomepage = (req, res, next) => {
    res.status(200).send(homepageData)
    .catch(next);
};

module.exports = apiHomepage;
