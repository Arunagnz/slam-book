const { ApolloServer } = require("apollo-server");

require("colors");
require("dotenv").config();

const db = require("./sequelize");

// Ananymous function to assert database connection
(async () => {
  try {
    await db.authenticate();
    console.log("DB authentication successful".cyan);
  } catch (err) {
    console.error(`DB authentication failed : ${err.message}`.red);
    process.exit(1);
  }
})();

const schema = require("./graphql/schema");

const port = process.env.PORT || 5000;

const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
});

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server starts listening at ${url}`.magenta);
});
