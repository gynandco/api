module.exports = {

    async getAllJobs(_, args, { dataSources }) {
        const params = { ...args };
        const data = await dataSources.job.findAll(params);
        return data;
    },

};
