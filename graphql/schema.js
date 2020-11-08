const { makeExecutableSchema } = require("apollo-server");
const { constraintDirective } = require("graphql-constraint-directive");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaTransforms: [constraintDirective()],
});
