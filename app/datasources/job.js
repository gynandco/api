const CoreSQLDataSource = require('./core/sql');

class Job extends CoreSQLDataSource {
    tableName = 'job';
}

module.exports = Job;
