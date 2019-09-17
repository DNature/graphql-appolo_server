const postsResolvers = require('./posts');
const usersResulvers = require('./users');

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResulvers.Mutation
    }
};