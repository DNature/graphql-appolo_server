const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

module.exports = context => {
    //? Context = {...Headers}
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        //? Bearer ...Token
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]'");
    }
    throw new Error('Authorization Header must be Provided');
};