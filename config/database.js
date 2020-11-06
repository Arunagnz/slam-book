const { Sequelize } = require("sequelize");

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST } = process.env;

const db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: "mysql",
  logging: (msg) => console.log(msg.yellow),
});

const connect = async () => {
  try {
    await db.authenticate();
    console.log("DB authentication successful".cyan);
  } catch (err) {
    console.error(`DB authentication failed : ${err.message}`.red);
    process.exit(1);
  }
};

connect();

module.exports = db;
