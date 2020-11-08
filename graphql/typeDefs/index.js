const { constraintDirectiveTypeDefs } = require("graphql-constraint-directive");

const userType = require("./userType");

module.exports = [constraintDirectiveTypeDefs, userType];
