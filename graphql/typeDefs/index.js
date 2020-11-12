const { constraintDirectiveTypeDefs } = require("graphql-constraint-directive");
const { mergeTypeDefs } = require("@graphql-tools/merge");

const postType = require("./postType");
const userType = require("./userType");
const commentType = require("./commentType");

const typeArray = [
  constraintDirectiveTypeDefs,
  postType,
  userType,
  commentType,
];

module.exports = mergeTypeDefs(typeArray);
