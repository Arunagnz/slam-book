const usersResolvers = require("./user");
const postsResolvers = require("./post");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation
  },
};
