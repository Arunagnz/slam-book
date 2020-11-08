const { ApolloServer } = require("apollo-server");

require("colors");
require("dotenv").config();

const schema = require("./graphql/schema")

const port = process.env.PORT || 5000;

const server = new ApolloServer({
  schema,
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server starts listening at ${url}`.magenta);
});
