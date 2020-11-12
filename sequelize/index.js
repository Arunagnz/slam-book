const { Sequelize } = require("sequelize");
const { applyComposition } = require("./composition");

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;

const db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: (msg) => console.log(msg.yellow),
  logQueryParameters: true,
  benchmark: true,
});

const modelDefiners = [
  require("./models/user.model"),
  require("./models/post.model"),
  require("./models/comment.model"),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(db);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyComposition(db);

// We export the sequelize connection instance to be used around our app.
module.exports = db;
