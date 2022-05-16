const { gql } = require('apollo-server');
const { readFileSync } = require('fs');
const path = require('path');

// Types
const job = readFileSync(path.join(__dirname, './job.gql'));

// Query and mutation
const query = readFileSync(path.join(__dirname, './query.gql'));

const schema = gql`
    
    ${job}

    ${query}

`;

module.exports = schema;
