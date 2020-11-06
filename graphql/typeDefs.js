const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    avatarUrl: String!
    createdAt: String!
    updatedAt: String!
  }
  type UserResponse {
    code: String!
    success: Boolean!
    message: String!
    token: String
    data: User
  }
  input RegisterInput {
    firstName: String! @constraint(minLength: 5, maxLength: 255,pattern: "^[0-9a-zA-Z]*$")
    lastName: String! @constraint(minLength: 5, maxLength: 255,pattern: "^[0-9a-zA-Z]*$")
    email: String! @constraint(format: "email")
    password: String! @constraint(minLength: 7, maxLength: 255)
    confirmPassword: String! @constraint(minLength: 7, maxLength: 255)
  }
  type Query {
    getUser(userId: ID!): UserResponse!
  }
  type Mutation {
    register(registerInput: RegisterInput!): UserResponse!
    login(email: String!, password: String!): UserResponse!
  }
`;
