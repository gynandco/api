const depthLimit = require('graphql-depth-limit');

// Schemas & Resolvers
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

module.exports = {
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5)],
};
