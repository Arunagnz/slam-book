const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    userId: String!
    createdAt: String!
    updatedAt: String!
  }
  type PostResponse {
    code: String!
    success: Boolean!
    message: String!
    data: Post
  }
  type AllPostResponse {
    code: String!
    success: Boolean!
    message: String!
    data: [Post]!
  }
  type Query {
    getPost(postId: ID!): PostResponse!
    getAllPost: AllPostResponse!
  }
  type Mutation {
    createPost(postBody: String!): PostResponse!
    updatePost(postId: ID!, postBody: String!): PostResponse!
    deletePost(postId: ID!): PostResponse!
  }
`;
