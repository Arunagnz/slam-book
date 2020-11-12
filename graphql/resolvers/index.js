const usersResolvers = require("./user");
const postsResolvers = require("./post");
const commentsResolvers = require("./comment");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...postsResolvers.Query,
    ...commentsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
