const { SQLDataSource } = require('datasource-sql');
const DataLoader = require('dataloader');

// Default cache is 5
const SECONDS = 10;

class CoreSQLDataSource extends SQLDataSource {
    tableName;

    constructor(knexConfig) {
        super({ client: knexConfig.client });
        this.establishedConnection = knexConfig.establishedConnection;
    }

    async findAll({ skip, take, ...params } = {}) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*');
        if (params) {
            Object.entries(params).forEach(([param, value]) => {
                if (param === '$or') {
                    query.where((builder) => {
                        Object.entries(value).forEach(([key, val]) => {
                            builder.orWhere(key, val);
                        });
                    });
                } else {
                    query.where(param, value);
                }
            });
        }

        if (skip) query.offset(skip);
        if (take) query.limit(take);

        // !Attention : the cache() method from sql-datasource execute the request directly
        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    async insert(data) {
        const result = await this.knex(this.tableName)
            .connection(this.establishedConnection)
            .insert(data)
            .returning('*');
        return result[0];
    }

    async update({ id }, inputData) {
        const result = await this.knex(this.tableName)
            .connection(this.establishedConnection)
            .where({ id })
            .update({ ...inputData, updated_at: new Date() })
            .returning('*');
        return result;
    }

    async delete(id) {
        const result = await this.knex(this.tableName)
            .connection(this.establishedConnection)
            .where({ id })
            .delete();
        return result;
    }

    async findByPkBulk(ids) {
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .whereIn('id', ids);

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result;
    }

    idLoader = new DataLoader(async (ids) => {
        const intIds = ids.map((id) => parseInt(id, 10));
        const records = await this.findByPkBulk(intIds);

        return intIds.map((id) => records.find((record) => record.id === id));
    });

    async findByPk(id) {
        if (process.env.DATALOADER_ENABLED) {
            return this.idLoader.load(id);
        }
        const query = this.knex(this.tableName)
            .connection(this.establishedConnection)
            .select('*')
            .where({ id });

        const result = await ((process.env.CACHE_ENABLED) ? query.cache(SECONDS) : query);
        return result[0];
    }
}

module.exports = CoreSQLDataSource;
