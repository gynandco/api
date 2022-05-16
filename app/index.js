const depthLimit = require('graphql-depth-limit');

// Schemas & Resolvers
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

// Database
const db = require('./db/pg');

// DataSources
const Job = require('./datasources/job');

// Knex
const knexConfig = {
    client: 'pg',
    establishedConnection: db,
};

module.exports = {
    typeDefs,
    resolvers,
    dataSources: () => ({
        // SQL
        job: new Job(knexConfig),
    }),
    validationRules: [depthLimit(5)],
};
