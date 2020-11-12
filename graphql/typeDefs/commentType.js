const { gql } = require("apollo-server");

module.exports = gql`
  type Comment {
    id: ID!
    body: String!
    postId: String!
    userId: String!
    createdAt: String!
    updatedAt: String!
  }
  type CommentResponse {
    code: String!
    success: Boolean!
    message: String!
    data: Comment
  }
  type AllCommentResponse {
    code: String!
    success: Boolean!
    message: String!
    data: [Comment]!
  }
  type Query {
    getComment(commentId: ID!): CommentResponse!
    getAllComment(postId: ID!): AllCommentResponse!
  }
  type Mutation {
    createComment(postId: ID!, commentBody: String!): CommentResponse!
    updateComment(commentId: ID!, commentBody: String!): CommentResponse!
    deleteComment(commentId: ID!): CommentResponse!
  }
`;
