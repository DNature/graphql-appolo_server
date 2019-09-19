const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

// Generate token
module.exports.generateToken = user => {
    return jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET, { expiresIn: '1h' }
    );
};