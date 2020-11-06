const { ApolloServer, makeExecutableSchema } = require("apollo-server");
const {
  constraintDirective,
  constraintDirectiveTypeDefs,
} = require("graphql-constraint-directive");

require("colors");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers,
  schemaTransforms: [constraintDirective()],
});

const port = process.env.PORT || 5000;

const server = new ApolloServer({
  schema,
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`.magenta);
});
