const { constraintDirectiveTypeDefs } = require("graphql-constraint-directive");
const { mergeTypeDefs } = require('@graphql-tools/merge');

const postType = require("./postType");
const userType = require("./userType");

const typeArray = [constraintDirectiveTypeDefs, postType, userType];

module.exports = mergeTypeDefs(typeArray);
