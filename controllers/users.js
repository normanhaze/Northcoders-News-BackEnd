const { User } = require('../models');

const getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    User.findOne({ username })
    .then(user => {
        if (user !== null) res.status(200).send({ user });
        else throw {status: 404, message: `User ${username} not found`};
    })
    .catch(next);
};

module.exports = { getUserByUsername };